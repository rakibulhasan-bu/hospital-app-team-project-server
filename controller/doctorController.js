const branchModel = require("../models/branchModel");
const doctorModel = require("../models/doctorModel");
const CatchAsyncError = require("../utils/CatchAsyncError");
const { ErrorHandler } = require("../utils/error");

const createDoctor = CatchAsyncError(
    async (req, res, next) => {
        try {
            const data = req.body;

            if (Object.keys(data).length === 0) {
                return next(new ErrorHandler("Please provide doctors data", 400));
            }

            const isBranchExist = await branchModel.findOne({ name: data?.hospitalName });
            if (!isBranchExist) {
                return next(new ErrorHandler(`${data?.hospitalName} this hospital branch is not available`, 404))
            }

            const doctor = await doctorModel.create(data);
            res.status(201).json({
                success: true,
                doctor
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

const getAllDoctors = CatchAsyncError(
    async (_req, res, next) => {
        try {
            const doctors = await doctorModel.find();
            res.status(200).json({
                success: true,
                doctors
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
)

const getDoctorsByBranchId = CatchAsyncError(
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const branch = await branchModel.findById(id);
            if (!branch) {
                return next(new ErrorHandler("Branch not found!", 404))
            }

            const doctors = await doctorModel.find({ hospitalName: branch?.name });
            if (doctors.length === 0) {
                return next(new ErrorHandler(`${branch?.name} branch haven't any doctor`, 404));
            }

            res.status(200).json({
                success: true,
                doctors
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
)

const getSingleDoctor = CatchAsyncError(
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const doctor = await doctorModel.findById(id);

            if (!doctor) {
                return next(new ErrorHandler("Doctor not found!"), 404);
            }

            res.status(200).json({
                success: true,
                doctor
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
)

const updateSingleDoctor = CatchAsyncError(
    async (req, res, next) => {
        try {
            const { id } = req.params;

            const { name, email, phone, imageUrl, fees } = req.body;
            if (!name && !email && !phone && !imageUrl && !fees) {
                return next(new ErrorHandler("Provide name or email or phone or image url or fees for update", 400));
            }

            const updateData = { name, email, phone, imageUrl, fees };
            const doctor = await doctorModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
            if (!doctor) {
                return next(new ErrorHandler("Doctor updated unsuccessful", 404))
            }

            res.status(201).json({
                success: true,
                doctor
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
)

const deleteSingleDoctor = CatchAsyncError(
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const doctor = await doctorModel.findByIdAndRemove(id);

            if (!doctor) {
                return next(new ErrorHandler("Doctor not found!"), 404);
            }

            res.status(200).json({
                success: true,
                message: `${doctor?.name} doctor deleted successfully.`
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
)

module.exports = { createDoctor, getAllDoctors, getDoctorsByBranchId, getSingleDoctor, updateSingleDoctor, deleteSingleDoctor };