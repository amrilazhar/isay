const crypto = require("crypto");
const path = require("path");
const validator = require("validator");
const mongoose = require("mongoose");
const { status, comment, profile, interest } = require("../../models");

//Todo : Create
exports.create = async (req, res, next) => {
	try {
		let errors = [];
	} catch (e) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: e.message,
		});
	}
};

//Todo : Update
exports.update = async (req, res, next) => {
	try {
		let errors = [];
	} catch (e) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: e.message,
		});
	}
};

//Todo : Delete
exports.delete = async (req, res, next) => {
	try {
		let errors = [];
	} catch (e) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: e.message,
		});
	}
};

//Todo : Get by Users
exports.user = async (req, res, next) => {
	try {
		let errors = [];
	} catch (e) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: e.message,
		});
	}
};

//Todo : Get by Interest
exports.interest = async (req, res, next) => {
	try {
		let errors = [];
	} catch (e) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: e.message,
		});
	}
};


