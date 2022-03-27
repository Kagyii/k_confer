//npm packages
const { validationResult } = require("express-validator");

//aws
const s3 = require("../aws/s3");

//models
const UserAuth = require("../models/user-auth");
const Profile = require("../models/profile");
const Follower = require("../models/follower");
const InterestedField = require("../models/interested-field");

module.exports.getProfile = async (req, res, next) => {
  const validationErr = validationResult(req);

  if (!validationErr.isEmpty()) {
    let err = new Error(validationErr.errors[0].msg);
    err.status = 0;
    return next(err);
  }
  try {
    const profile = new Profile();

    let [[getProfileResult]] = await profile.getByPid(req.query.profile_id);

    const follower = new Follower();

    let [[getFollowerCount]] = await follower.getFollowerCount(
      req.query.profile_id
    );

    getProfileResult.followerCount = getFollowerCount.followerCount - 1;

    if (req.query.profile_id == req.decodedToken.profileId) {
      let [[getFollowingCount]] = await follower.getFollowingCount(
        req.query.profile_id
      );

      getProfileResult.followingCount = getFollowingCount.followingCount - 1;
    } else {
      delete getProfileResult.account_type;
    }

    return res.json({
      status: 1,
      detail: getProfileResult,
    });
  } catch (err) {
    err.status = 0;
    return next(err);
  }
};

module.exports.setupProfile = async (req, res, next) => {
  const validationErr = validationResult(req);

  if (!validationErr.isEmpty()) {
    let err = new Error(validationErr.errors[0].msg);
    err.status = 0;
    return next(err);
  }

  let work = req.body.work || null;

  let workplace = req.body.workplace || null;

  let speciality = req.body.speciality || null;

  let hometown = req.body.hometown || null;

  let interestedFields = req.body.interestedFields;

  let userInterestedFields = [];

  const profilePictureBucket = "k-confer-profile-picture";

  interestedFields.forEach((i) => {
    userInterestedFields.push([req.decodedToken.profileId, i]);
  });

  try {
    let [s3PpPath] = await s3.uploadImage(req.body.image, profilePictureBucket);

    const profile = new Profile();

    await profile.setup(
      req.body.university,
      hometown,
      speciality,
      work,
      workplace,
      s3PpPath,
      req.body.studentYear,
      req.decodedToken.profileId
    );

    const user = new UserAuth();

    await user.addProfileSetup(req.decodedToken.userId);

    const interestedField = new InterestedField();

    await interestedField.save(userInterestedFields);

    let [[getProfileResult]] = await profile.getByPid(
      req.decodedToken.profileId
    );

    const follower = new Follower();

    let [[getFollowerCount]] = await follower.getFollowerCount(
      getProfileResult.id
    );

    getProfileResult.followerCount = getFollowerCount.followerCount - 1;

    let [[getFollowingCount]] = await follower.getFollowingCount(
      getProfileResult.id
    );

    getProfileResult.followingCount = getFollowingCount.followingCount - 1;

    return res.json({
      status: 1,
      details: getProfileResult,
    });
  } catch (err) {
    console.log(err);
    err.status = 0;
    return next(err);
  }
};
