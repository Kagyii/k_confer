//utility
const suggestedInput = require('../util/suggestion')


module.exports.profileSetup = (req, res, next) => {

    return res.json({
        status: 1,
        universityList: suggestedInput.universityList,
        workList: suggestedInput.workList,
        specialityList: suggestedInput.specialityList,
        workplaceList: suggestedInput.workplaceList,
        studentYearList: suggestedInput.studentYearList,
        interestedFieldList: suggestedInput.interestedFieldList //note
    })


}