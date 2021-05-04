const validator = require("validator");
const mongoose = require("mongoose");
const { status, comment, profile } = require("../../models");

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

exports.get = async (req, res, next) => {
	try {
		let errors = [];
	} catch (e) {
		return res.status(500).json({
			message: "Internal Server Error",
			error: e.message,
		});
	}
};
