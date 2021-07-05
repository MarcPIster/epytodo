const express = require("express");


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]

        console.log(bearerHeader)
        req.token = bearerToken
        next()
    } else {
        res.status(403)
        res.send("forbidden")
    }
}

module.exports = {verifyToken};