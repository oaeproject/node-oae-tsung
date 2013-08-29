/*
 * Copyright 2013 Apereo Foundation (AF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var _ = require('underscore');
var User = require('../../lib/api/user');

/**
 * Visit a user and browse their profile.
 *
 * @param  {Session}    session                 The Tsung user session
 * @param  {String}     userId                  The id of the user whose profile to visit
 * @param  {Number}     contentLibraryPages     The number of pages in the user's content library to browse
 * @param  {Number}     discussionLibraryPages  The number of pages in the user's discussion library to browse
 * @param  {Number}     membershipsPages        The number of pages in the user's memberships page to browse
 * @param  {Number}     networkPages            The number of pages in the user's network to browse
 */
var userProfile = module.exports.userProfile = function(session, userId, contentLibraryPages, discussionLibraryPages, membershipsPages, networkFollowersPages, networkFollowingPages) {
    contentLibraryPages = contentLibraryPages || 0;
    discussionLibraryPages = discussionLibraryPages || 0;
    membershipsPages = membershipsPages || 0;

    var i = 0;

    // Load the user profile, which defaults to the content library
    User.contentLibrary(session, userId, {'pageLoad': true});
    session.think(7, true);

    // Browse more content library pages if specified
    if (contentLibraryPages) {
        for (i = 1; i < contentLibraryPages; i++) {
            User.contentLibraryScroll(session, userId);
            session.think(7, true);
        }
    }

    // Browse the discussion library pages if specified
    if (discussionLibraryPages) {
        User.discussionLibrary(session, userId);
        session.think(7, true);

        for (i = 1; i < discussionLibraryPages; i++) {
            User.discussionLibraryScroll(session, userId);
            session.think(7, true);
        }
    }

    if (membershipsPages) {
        User.memberships(session, userId);
        session.think(7, true);

        for (i = 1; i < membershipsPages; i++) {
            User.membershipsScroll(session, userId);
            session.think(7, true);
        }
    }

    if (networkFollowersPages) {
        User.networkFollowers(session, userId);
        session.think(7, true);

        for (i = 1; i < networkFollowersPages; i++) {
            User.networkFollowersScroll(session, userId);
            session.think(7, true);
        }
    }

    if (networkFollowingPages) {
        User.networkFollowing(session, userId);
        session.think(7, true);

        for (i = 1; i < networkFollowingPages; i++) {
            User.networkFollowingScroll(session, userId);
            session.think(7, true);
        }
    }
};
