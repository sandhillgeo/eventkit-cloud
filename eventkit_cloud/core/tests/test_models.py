# -*- coding: utf-8 -*-

from unittest.mock import patch, MagicMock

from eventkit_cloud.auth.models import OAuth
from eventkit_cloud.core.models import AttributeClass, update_all_attribute_classes_with_user, \
    update_all_users_with_attribute_class, get_users_from_attribute_class, validate_user_attribute_class, \
    annotate_users_restricted, get_unrestricted_users

import json
import logging
from django.contrib.auth.models import User

from django.test import TestCase

logger = logging.getLogger(__name__)


class TestCoreModels(TestCase):

    def setUp(self, ):

        self.user1 = User.objects.create_user(
            username='demo1', email='demo@demo.com', password='demo1'
        )
        self.user2 = User.objects.create_user(
            username='demo2', email='demo@demo.com', password='demo2'
        )
        self.attribute_class = AttributeClass.objects.create(name="test", slug="test")

    @patch("eventkit_cloud.core.models.update_all_users_with_attribute_class")
    def test_save(self, mock_update_all_users_with_attribute_class):
        self.attribute_class.name = "new"
        self.attribute_class.save()
        mock_update_all_users_with_attribute_class.assert_not_called()
        self.attribute_class.filter = json.dumps({"some": "new_filter"})
        self.attribute_class.save()
        mock_update_all_users_with_attribute_class.assert_called_once()

    @patch("eventkit_cloud.core.models.validate_user_attribute_class")
    def test_update_all_attribute_classes_with_user(self, mock_validate_user_attribute_class):
        mock_validate_user_attribute_class.return_value = True
        update_all_attribute_classes_with_user(self.user1)
        self.assertCountEqual(list(self.attribute_class.users.all()), [self.user1])

        mock_validate_user_attribute_class.return_value = False
        update_all_attribute_classes_with_user(self.user1)
        self.assertCountEqual(list(self.attribute_class.users.all()), list())

    @patch("eventkit_cloud.core.models.get_users_from_attribute_class")
    def test_update_all_users_with_attribute_class(self, mock_get_users_from_attribute_class):
        users = User.objects.all()
        mock_get_users_from_attribute_class.return_value = list(users)
        update_all_users_with_attribute_class(self.attribute_class)
        self.assertCountEqual(list(self.attribute_class.users.all()), list(users))

    @patch("eventkit_cloud.core.models.validate_object")
    def test_get_users_from_attribute_class(self, mock_validate_object):
        self.attribute_class.filter = {"username": "demo1"}
        self.attribute_class.save()
        users = get_users_from_attribute_class(self.attribute_class)
        self.assertCountEqual(list(users), list(User.objects.filter(id=self.user1.id)))

        expected_response = list(User.objects.filter(id=self.user2.id))
        mock_validate_object.return_value = expected_response
        OAuth.objects.create(user=self.user2, identification="test_ident",
                             commonname="test_common", user_info={"color": "blue"})
        self.attribute_class.filter = None
        self.attribute_class.complex = ["blue", "==", "color"]
        users = get_users_from_attribute_class(self.attribute_class)
        self.assertCountEqual(list(users), expected_response)

        expected_response = list()
        mock_validate_object.return_value = expected_response
        self.attribute_class.complex = ["red", "==", "color"]
        users = get_users_from_attribute_class(self.attribute_class)
        self.assertCountEqual(list(users), expected_response)

    @patch("eventkit_cloud.core.models.validate_object")
    def test_validate_user_attribute_class(self, mock_validate_object):
        self.attribute_class.filter = {"username": "demo1"}
        self.attribute_class.save()
        self.assertTrue(validate_user_attribute_class(self.user1, self.attribute_class))

        mock_validate_object.return_value = True
        OAuth.objects.create(user=self.user2, identification="test_ident",
                             commonname="test_common", user_info={"color": "blue"})
        self.attribute_class.filter = None
        self.attribute_class.complex = ["blue", "==", "color"]
        self.attribute_class.save()
        self.assertTrue(validate_user_attribute_class(self.user2, self.attribute_class))

        mock_validate_object.return_value = False
        self.attribute_class.complex = ["red", "==", "color"]
        self.attribute_class.save()
        self.assertFalse(validate_user_attribute_class(self.user2, self.attribute_class))

    @patch("eventkit_cloud.core.models.get_unrestricted_users")
    def test_annotate_users_restricted(self, mock_get_unrestricted_users):
        expected_unrestricted_users = User.objects.filter(username="demo2")
        mock_get_unrestricted_users.return_value = expected_unrestricted_users
        users = User.objects.all()
        job = MagicMock()
        users = annotate_users_restricted(users, job)
        self.assertTrue(users[0].restricted)
        self.assertFalse(users[1].restricted)

    def test_get_unrestricted_users(self):
        job = MagicMock()
        provider_task = MagicMock()
        provider_task.provider.attribute_class = self.attribute_class
        job.provider_tasks.all.return_value = [provider_task]
        self.attribute_class.users.set([self.user1])
        users = User.objects.all()
        unrestricted_users = get_unrestricted_users(users, job)
        self.assertEqual(len(unrestricted_users), 1)
        self.assertEqual(self.user1, unrestricted_users.first())