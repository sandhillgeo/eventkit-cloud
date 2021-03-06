#!/bin/bash

celery worker -A eventkit_cloud -Ofair --concurrency=$RUNS_CONCURRENCY --loglevel=$LOG_LEVEL -n runs@%h -Q runs & \
celery worker -A eventkit_cloud -Ofair --concurrency=$CONCURRENCY --loglevel=$LOG_LEVEL -n worker@%h -Q $CELERY_GROUP_NAME & \
celery worker -A eventkit_cloud -Ofair --concurrency=1 --loglevel=$LOG_LEVEL -n celery@%h -Q celery & \
celery worker -A eventkit_cloud -Ofair --concurrency=1 --loglevel=$LOG_LEVEL -n priority@%h -Q $CELERY_GROUP_NAME.priority,$HOSTNAME.priority & \
celery worker -A eventkit_cloud -Ofair --concurrency=$OSM_CONCURRENCY --loglevel=$LOG_LEVEL -n large@%h -Q $CELERY_GROUP_NAME.large
