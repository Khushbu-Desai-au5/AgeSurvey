const UserModel = require("../models/usermodel")
const axios = require("axios")


module.exports.homepage = (req, response) => {
    axios.get("https://randomuser.me/api/?results=1000")
        .then(res => {
            //console.log("res", res.data.results)
            res.data.results.map(user => {
                const model = new UserModel({
                    name: user.name.title + " " + user.name.first + " " + user.name.last,
                    email: user.email,
                    age: user.dob.age,
                    gender: user.gender,
                    country: user.location.country,
                    nationality: user.nat
                })
                if (parseInt(user.dob.age) > 0 && parseInt(user.dob.age) < 31) { count++ }


                model
                    .save()
                    .then((user) => {
                        //  console.log("user saved in db Successfully")
                    })
                    .catch(err => {
                        console.log('error in saveing user in db.', err)
                    })
            })
            response.json("Saved Successfully.")
        })
        .catch(err => console.log("Error while fatching data", err))
}

module.exports.calculate = async (req, res) => {
    const gender = req.params.gender
    let under30Age
    let between30to50Age
    let above50Age

    try {
        under30Age = await UserModel.aggregate([
            { $match: { age: { $gte: 0, $lt: 31 } } },
            {
                $group: {
                    _id: { nationality: '$nationality', gender: '$gender' },
                    count: { $sum: 1 }
                }
            }
        ])

        between30to50Age = await UserModel.aggregate([
            { $match: { age: { $gt: 30, $lt: 51 } } },
            {
                $group: {
                    _id: { nationality: '$nationality', gender: '$gender' },
                    count: { $sum: 1 }
                }
            }
        ])

        above50Age = await UserModel.aggregate([
            { $match: { age: { $gt: 50 } } },
            {
                $group: {
                    _id: { nationality: '$nationality', gender: '$gender' },
                    count: { $sum: 1 }
                }
            }
        ])

        //get data for men

        let resultDataForMen = under30Age.filter(data => data._id.gender === 'male')
        let dataForMen = {}
        resultDataForMen.map(data => {
            dataForMen[data._id.nationality] = {
                'under30Age': data.count
            }
        })

        resultDataForMen = between30to50Age.filter(data => data._id.gender === 'male')
        resultDataForMen.map(data => {
            if (!dataForMen[data._id.nationality]) {
                dataForMen[data._id.nationality] = {
                    'between30to50Age': data.count
                }
            } else {
                dataForMen[data._id.nationality]['between30to50Age'] = data.count
            }

        })

        resultDataForMen = above50Age.filter(data => data._id.gender === 'male')
        resultDataForMen.map(data => {
            if (!dataForMen[data._id.nationality]) {
                dataForMen[data._id.nationality] = {
                    above50Age: data.count
                }
            } else {
                dataForMen[data._id.nationality]['above50Age'] = data.count
            }

        })

        //Women Data 
        let resultDataForFemale = under30Age.filter(data => data._id.gender === 'female')


        let dataForFemale = {}
        resultDataForFemale.map(data => {
            dataForFemale[data._id.nationality] = {
                'under30Age': data.count
            }
        })

        resultDataForFemale = between30to50Age.filter(data => data._id.gender === 'female')
        resultDataForFemale.map(data => {
            if (!dataForFemale[data._id.nationality]) {
                dataForFemale[data._id.nationality] = {
                    between30to50Age: data.count
                }
            } else {
                dataForFemale[data._id.nationality]['between30to50Age'] = data.count
            }

        })
        //console.log('dataForFemale', dataForFemale)

        resultDataForFemale = above50Age.filter(data => data._id.gender === 'female')
        resultDataForFemale.map(data => {
            if (!dataForFemale[data._id.nationality]) {
                dataForFemale[data._id.nationality] = {
                    above50Age: data.count
                }
            } else {
                dataForFemale[data._id.nationality]['above50Age'] = data.count
            }
        })
        //console.log('dataForFemale', dataForFemale)

        res.render('index', {
            dataForMen,
            dataForFemale
        })
    } catch (err) {
        res.json(err)
    }
}


