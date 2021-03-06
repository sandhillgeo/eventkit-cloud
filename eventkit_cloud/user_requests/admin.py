from django.contrib import admin

from eventkit_cloud.user_requests.models import (
    DataProviderRequest,
    SizeIncreaseRequest,
    UserSizeRule,
)


class DataProviderRequestAdmin(admin.ModelAdmin):
    list_display = [
        "uid",
        "status",
        "user",
        "name",
        "url",
        "service_description",
        "created_at",
        "updated_at",
    ]

    list_filter = [
        "status",
    ]

    readonly_fields = [
        "uid",
        "created_at",
        "updated_at",
    ]

    search_fields = [
        "uid",
        "user",
    ]


class SizeIncreaseRequestAdmin(admin.ModelAdmin):
    list_display = [
        "uid",
        "status",
        "user",
        "provider",
        "requested_aoi_size",
        "requested_data_size",
        "created_at",
        "updated_at",
    ]

    list_filter = [
        "status",
        "provider",
    ]

    readonly_fields = [
        "uid",
        "created_at",
        "updated_at",
    ]

    search_fields = [
        "uid",
        "user",
    ]


admin.site.register(DataProviderRequest, DataProviderRequestAdmin)
admin.site.register(SizeIncreaseRequest, SizeIncreaseRequestAdmin)
admin.site.register(UserSizeRule)
