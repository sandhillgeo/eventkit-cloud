## Settings
The following are a few of the relevant environment variables that can be used to adjust how eventkit_cloud is configured.

Settings can be configured in the docker setup by adjusting the environment variables in the docker-compose file.

For more information see the docker site https://docs.docker.com/compose/environment-variables/.

Note: Many settings merely look for the value to exist in the environment to mean true, meaning if you have SOMETHING=False in your environment, then something will be true because it exists.

### Site
The sitename and the hostname are added to allowed hosts.  This is used for security purposes.  The SITE_NAME should match what users are accessing the site on.
<pre>HOSTNAME=cloud.eventkit.test</pre>
(default: the host machines hostname)
<pre>SITE_NAME=cloud.eventkit.test</pre>
(default: HOSTNAME)

The SITE_URL is used when providing links for users.  This should include the SITE_NAME but can provide additional context like https.
<pre>SITE_URL=http://cloud.eventkit.test</pre>
(default: http://<SITE_NAME>)

The SECRET_KEY is a django setting used to encrypt certain items with in the application
This should random, kept secret, and shared between any webserver portions of the application (i.e. the api and map)
<pre>SECRET_KEY=some_super_secret_key</pre>

Set CONTENT_SECURITY_POLICY for the browser to allow external resources. 
<pre>CONTENT_SECURITY_POLICY="default-src 'none'; style-src cdn.example.com;"</pre>

### Storage

#### S3 Storage
If you want your export files to be stored on S3 rather than locally add:
<pre>USE_S3=True
AWS_STORAGE_BUCKET_NAME='my-bucket'
AWS_ACCESS_KEY_ID='my-access-key'
AWS_SECRET_ACCESS_KEY='my-secret-key'</pre>

#### Database
To use your own database connection string add:
<pre>DATABASE_URL='postgis://user:password@site:5432/database_name'</pre>

To reset the database:
<pre>docker volume rm eventkitcloud_postgis_database</pre>
<pre>docker-compose run --rm eventkit python manage.py runinitial setup</pre>

#### Broker URL
To specify which RabbitMQ instance to use add:
<pre>BROKER_URL='amqp://guest:guest@rabbitmq:5672/'</pre>

#### Export Directories
To change where exports are staged for processing, cached, downloaded to, etc, the following environment variables can be set.

| Variable Name | Description |
|---------------|-------------|
| EXPORT_STAGING_ROOT  | Where exports are staged for processing. |
| TILE_CACHE_DIR | Where tiles are cached. |
| EXPORT_RUN_FILES_DOWNLOAD | Where export run files can be downloaded. |
| EXPORT_DOWNLOAD_ROOT | Where exports are stored for public download. |
| EXPORT_MEDIA_ROOT | The root URL for export downloads. |
| KEEP_STAGE | Whether to keep the staging directory after an export is finished. |

If any of these needs to be changed, it can be done by setting them in the docker-compose file.
<pre>EXPORT_STAGING_ROOT='/path/to/staging/dir/'</pre>

#### Task error email
To configure the email address that will send out any error messages add:
<pre>EMAIL_HOST_USER='email@email.com'
EMAIL_HOST_PASSWORD='email-password'
</pre>


#### Overpass API
To use your own instance of an Overpass API add:
<pre>OVERPASS_API_URL='my-overpass-site.com/api/interpreter'</pre>

If an Overpass API endpoint requires a client certificate, you can provide it as an environment variable in PEM format:
```
<provider slug>_CERT='-----BEGIN CERTIFICATE-----
[certificate contents]
-----END CERTIFICATE-----
-----BEGIN PRIVATE KEY-----
[private key contents]
-----END PRIVATE KEY-----'
```

This OVERPASS_API_URL setting is deprecated.  It is better to add your Overpass API endpoint directly as a DataProvider, and specify the endpoint as the URL.  That will also allow the endpoint to be queried for last update metadata.

Additionally when using overpass you can set the max ram allowed by the server. [more info](http://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL#Element_limit_.28maxsize.29)
<pre>OVERPASS_MAX_SIZE=2147483648</pre>
<pre>OVERPASS_TIMEOUT=1600</pre>


#### Geocoder

By default EventKit will use geonames.org.

However significant support was added for [pelias](http://github.com/pelias), including reverse geocoding, and better map support.

##### Pelias Settings:

###### Forward Geocoding
Used for providing a text search for finding places and their location in the search box.
<pre>GEOCODING_API_URL='http://my-pelias.com/api/v1/search'</pre>
<pre>GEOCODING_API_TYPE='pelias'</pre>

###### Reverse Geocoding
Used for providing a location and getting the names of locations in the search box.
<pre>REVERSE_GEOCODING_API_URL='http://my-pelias.com/api/v1/reverse'</pre>

###### Place Lookup
Used in EventKit to search up the hierarchy to assist in zooming to locations.
<pre>GEOCODING_UPDATE_URL='http://my-pelias.com/api/v1/place'</pre>

###### Convert
Used with a [custom version](https://github.com/eventkit/pelias-api) of the API to convert coordinates.
<pre>CONVERT_API_URL='http://my-pelias.com/api/v1/convert'</pre>

###### Authentication
If authentication is needed, the following environment variables may be used.

| Variable Name | Description |
|---------------|-------------|
| GEOCODING_AUTH_URL  | The geocoder's authentication endpoint. |
| GEOCODING_AUTH_CERT | The certificate, loaded as a single string, to be used for authentication. |

#### Map Settings
##### Basemap URL
To set the application basemap add:
<pre>BASEMAP_URL=http://my-tile-service.com/{z}/{x}/{y}.png</pre>
##### Basemap Copyright
To set the copyright information for your basemap add (for example):
<pre>© My Copyright</pre>
##### Max Extent
A value to warn users that the datapack will not include any datasets.
Exceeding this as a selection will prevent the user from proceeding.
<pre>JOB_MAX_EXTENT=10000</pre>
Where 10000 is an integer representing sq km.

#### Data Authentication

When configuring data sources, instead of storing credentials in the URLs in the database,
service credentials can be added to the environment using the service slug as the name.

For example a slug of 'osm' would use environment variables `OSM_CRED` or `OSM_CERT` if requiring authentication.

If there are many services that use the same certificate, a certificate can be added to the environment and then referenced,
in the configuration block for each data provider.  For example, the certificate can be loaded as a single string in an
environment setting, `SOURCE_CERT`.  Then in each data provider, in the configuration block, there would be a key
and value added `cert_var: SOURCE_CERT`.  _Note: The cert_var IS case sensitive._


##### Basic Auth
To use basic auth, add the username and password to the environment as such
<pre>SLUG_CRED='username:password'</pre>
##### Certificate
To use basic auth, add the username and password to the environment as such
<pre>SLUG_CERT='-----BEGIN CERTIFICATE-----\n235235\n-----END CERTIFICATE-----'</pre>

For more on configuring data sources please visit the [data sources readme](./sources.md).


### Email Settings

EventKit can send users email notifying them about certain changes.

| Variable Name | Description | Default |
|---------------|-------------|---------|
| USE_EMAIL | A boolean on whether to enable email and use these settings | False |
| TASK_ERROR_EMAIL | The "from" account. |  None |
| DEFAULT_FROM_EMAIL | The name to use "from". | None |
| EMAIL_HOST | The SMTP email server. | None |
| EMAIL_PORT | The SMTP email server port. | 587 |
| EMAIL_HOST_USER | The account id to login to the SMTP server. | None |
| EMAIL_HOST_PASSWORD | The password to login to the SMTP server. | None |
| EMAIL_USE_TLS | Use TLS for communication with the SMTP server. | True |



### User Authentication

EventKit has some limited support for creating and authenticating users.  The solutions were tailored to use specific servers, but can be updated fairly easily using the settings files located in `eventkit_cloud/settings/prod.py`).

##### URLs
The relative paths for the login and logout URLs can be configured.
| Variable Name | Description |
|---------------|-------------|
| LOGIN_URL  | Relative login path. e.g. `/login`. |
| LOGOUT_URL | Relative logout path. e.g. `/logout`. |

##### Django Model Login
Django allows built in users to be created via the admin console (such as superusers), you can enable these users to log in with :
<pre>DJANGO_MODEL_LOGIN = True</pre>
(Default: False)

##### Auto Logout
These settings will limit the amount of time a user is logged into EventKit.  Users browsing the UI will automatically,
stay logged in.  If making API calls, an integrator will need to periodically make a request to `/user_active`, to
ensure that they remain logged in.  Additionally any calls to the admin page will all the user to remain logged in.
<pre>AUTO_LOGOUT_SECONDS=600</pre>
(Default: 0)
<pre>AUTO_LOGOUT_WARNING_AT_SECONDS_LEFT=300</pre>
(Default: 300)

##### LDAP
The LDAP settings leverage [django-auth-ldap](https://django-auth-ldap.readthedocs.io/en/latest/authentication.html#server-config) to do this.
Please see their documentation to configure LDAP the following settings are available in EventKit.

| Variable Name | Description |
|---------------|-------------|
| LDAP_SERVER_URI | The LDAP Server address (i.e. LDAP://something.com:636) |
| LDAP_BIND_DN | The user account for binding to the server |
| LDAP_BIND_PASSWORD | The password to bind to the server |
| LDAP_USER_DN_TEMPLATE | The user template (i.e. uid={0},ou=dev,dc=server,dc=com) |
| LDAP_SEARCH_DN | The search DN (i.e. dc=server,dc=com) |
</pre>

##### OAUTH
OAUTH targets specific servers, but it was written to be fairly generic and updating these settings could work out of the box.

| Variable Name | Description |
|---------------|-------------|
|OAUTH_NAME| The name of the Oauth provider (e.g. Google or Facebook) |
|OAUTH_CLIENT_ID| The Oauth ID |
|OAUTH_CLIENT_SECRET| The Oauth Secret |
|OAUTH_AUTHORIZATION_URL| The URL to request the Authorization Code |
|OAUTH_RESPONSE_TYPE| The type of authorization request (default `code`) |
|OAUTH_TOKEN_URL| The URL to request a user token with the Auth Code |
|OAUTH_TOKEN_KEY| The key of the actual token from the OAUTH_TOKEN_URL response. |
|OAUTH_LOGOUT_URL| The URL to log the user out. |
|OAUTH_REDIRECT_URI| The URL that the Oauth server should send the user after authorization. |
|OAUTH_SCOPE| The level of permission for authorization. |
|OAUTH_PROFILE_URL| The location to request the user profile. |
|OAUTH_PROFILE_SCHEMA| A JSON map of EventKit user schema and the remote user schema. |
The OAUTH PROFILE schema requires several fields
The OAuth profile needs to map to the User model.
The required fields are:
 - identification
 - username
 - commonname

The optional fields are:
 - first_name
 - last_name
 - email

An example:
<pre>
OAUTH_PROFILE_SCHEMA = {"identification": "ID",
                        "username": "username",
                        "email": ["email","mail", "login"],
                        "first_name": "firstname"
                        ...}</pre>
Note an array can be used and EventKit will try each one for a valid value to enter in the EventKit users profile.

#### Logging
<pre>DEBUG=True</pre>
<pre>LOG_LEVEL=Info</pre>

The MapProxy logger prints out various updates relating to seeding and external requests.

The log level for the Django logger may be changed from the default.
<pre>DJANGO_LOG_LEVEL=WARN</pre>

Setting this option to true will enable the MapProxy logger to print more periodic progress updates. In addition,
it will reduce the interval at which some logs are printed.
<pre>MAPPROXY_LOGS_VERBOSE=True</pre>

Setting this option to true will turn the secondary logs in "log_progress". The main log step is unaffected.
<pre>MAPPROXY_LOGS_SILENT=True</pre>

Setting this option to true will turn on the logging of external requests that MapProxy makes during seeding.
<pre>MAPPROXY_LOGS_REQUESTS=True</pre>


#### Land Data
EventKit includes land data with OSM exports, this data needs to be initially loaded and a custom location can be provided with:
<pre>LAND_DATA_URL=https://osmdata.openstreetmap.de/download/land-polygons-split-3857.zip</pre>

#### SSL Verification
By default SSL verification will be enabled and the system certificates and Certifi certs will be used.
A custom SSL cert file can be specified using:
<pre>SSL_VERIFICATION=/path/to/certificate.pem</pre>
SSL should be used but many services (especially geospatial services) don't have proper certificates with production CAs.
SSL can be disabled using:
<pre>SSL_VERIFICATION=False</pre>

if `SSL_VERIFICATION` does not point to certificate, then `REQUESTS_CA_BUNDLE` should be set.
<pre>REQUESTS_CA_BUNDLE=path/to/bundle</pre>

### UI Settings

#### Version
The version number will be display on the Login page and the About page.
<pre>VERSION='1.9.0'</pre>
#### Contact Url
The contact url will be displayed as a link on the About page.
<pre>CONTACT_URL='mailto:my.team@domain.com'</pre>
#### Disclaimer
You can add any disclaimer that need to be visible before login. It will appear alongside the login options.
The disclaimer can be a plain string or a string containing properly formatted HTML elements
<pre>LOGIN_DISCLAIMER='<{div}>my disclaimer<{/div}>'</pre>
#### Banner Color
If you choose to display a banner you can use this setting to change the default background color.
The value can be a hex code or color name.
<pre>BANNER_BACKGROUND_COLOR='#eee'</pre>
#### Banner Text Color
If you choose to display a banner you can use this setting to change the default text color.
Value can be a hex code or color name.
<pre>BANNER_TEXT_COLOR='blue'</pre>
#### Banner Text
Setting this value will display the text at the top of the page in a high visibility banner.
<pre>BANNER_TEXT='IMPORTANT TEXT FOR USERS TO SEE'</pre>
#### BASEMAP_URL
See "Map Settings".
#### BASEMAP_COPYRIGHT
See "Map Settings".
#### DataPack Expiration
Set a limit for keeping DataPacks in the system.
<pre>MAX_DATAPACK_EXPIRATION_DAYS='30'</pre>
#### DataPack Page Size
The default number of DataPacks to be displayed in the DataPack Library
<pre>DATAPACK_PAGE_SIZE='10'</pre>
#### Notifications Page Size
The default number of Notifications to be displayed in the Notifications page
<pre>NOTIFICATIONS_PAGE_SIZE='15'</pre>
#### User Groups Page Size
The default number of users to be loaded on the Groups Page
<pre>USER_GROUPS_PAGE_SIZE='20'</pre>
#### Serving Estimates
Estimates are provided for time to finish, data size, as well as in progress estimated finish times.
This is enabled by default, but if adding new services or deploying eventkit for the first time, these values may not
be very accurate.  To disable these estimates:
<pre>SERVE_ESTIMATES='false'</pre>

#### Matomo
| Variable Name | Description |
|---------------|-------------|
| MATOMO_URL | Matomo URL. |
| MATOMO_CUSTOM_DIM_ID | Custom tracker dimension ID. |
| MATOMO_CUSTOM_VAR_NAME | Custom variable name. |
| MATOMO_CUSTOM_VAR_ID | Custom variable ID. |
| MATOMO_CUSTOM_VAR_SCOPE | The custom variable's scope. Defaults to "page" |
| MATOMO_SITE_ID | ID of the site to be measured. |
| MATOMO_APPNAME | Application name. Defaults to "EventKit" |


### Concurrency Settings

These settings are used when setting up the celery workers in the `run-celery.sh` script.

#### Concurrency
The max number of processes/threads the `worker` celery worker will use to complete tasks at any one time.
<pre>CONCURRENCY=4</pre>
#### MapProxy Concurrency
Increases the number of concurrent requests when seeding data from a WMS/WMTS/ArcGIS Raster source.  This can also be done per [data source](https://github.com/EventKit/eventkit-cloud/blob/master/docs/sources.md#mapproxy-configuration).
<pre>MAPPROXY_CONCURRENCY=4</pre>
#### OSM Concurrency
Increases the number of concurrent requests when using an OSM source per run. The number of total OSM tasks that can be running at once will be effected by the `RUNS_CONCURRENCY` setting below.
<pre>OSM_CONCURRENCY=1</pre>
#### Runs Concurrency
The max number of processes/threads the `runs` celery worker will use. This will effect how many total OSM tasks can be running at one time per celery instance.
<pre>RUNS_CONCURRENCY=1</pre>

### Celery Task Settings

The maximum amount of times you want Celery to retry an export related task prior to failing it and moving on.
<pre>MAX_TASK_ATTEMPTS=5</pre>

This is the maximum size in memory to process osm data in MB.
After this size a file is used on disk next to the source data.
See: https://gdal.org/drivers/vector/osm.html#internal-working-and-performance-tweaking
<pre>OSM_MAX_TMPFILE_SIZE=100</pre>

### RocketChat Settings

Pass in this environment variable with your RocketChat settings to enable notifications about failed DataPacks to specific channel(s) or user(s).
<pre>ROCKETCHAT_NOTIFICATIONS={"auth_token": "personal_access_token", "user_id": "personal_user_id", "channels": ["#channel", "@username"], "url": "https://rocketchat.example.com/"}</pre>

### PCF Settings

EventKit can be configured to autoscale celery when deployed on Pivotal Cloud Foundry.  The settings for that
and some background is available in the [PCF Section](./pcf.md).

### Usage Settings

| Variable Name | Description |
|---------------|-------------|
| MAX_UPLOAD_SIZE | Size limit (in MB) for any geospatial file a user may upload. |
| DATAPACKS_DEFAULT_SHARED | Whether datapacks will be shared with other users by default. (true|false) |
| PROVIDER_CHECK_INTERVAL | How often (in minutes) to check the providers' availability. |
| FORCE_STATISTICS_RECOMPUTE | Whether to recompute provider statistic instead of reading them from cache. (True|False). |
| MAX_ESTIMATE_EXPORT_TASK_RECORDS | The maximum number of export task records to use when generating estimates. |


#### Scripts
Some of the scripts found under `/script` can be configured through the use of environment variables.

| Variable Name | Description |
|---------------|-------------|
| EVENTKIT_USER | Username used to authenticate. |
| EVENTKIT_PASS | Password used to authenticate. |