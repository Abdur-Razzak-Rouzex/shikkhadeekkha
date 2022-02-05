import mongoose from 'mongoose';

const admissionFormSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        studentInfo: {
            studentNameBn: {
                type: String,
                required: true
            },
            studentNameEn: {
                type: String,
                required: true,
            },
            dateOfBirth: {
                type: Date,
                required: true,
            },
            studentClass: {
                type: String,
                required: true,
            },
            instituteName: {
                type: String,
                required: true,
            },
            educationMedium: {
                type: String,
                required: true,
            },
            passportSizePhotoUrl: {
                type: String,
                required: true,
            },
        },

        parentsInfo: {
            fatherName: {
                type: String,
                required: true,
            },
            fatherProfession: {
                type: String,
                required: true,
            },
            motherName: {
                type: String,
                required: true,
            },
            motherProfession: {
                type: String,
                required: true,
            },
            parentsDirectContact: {
                type: String,
                required: true,
            },
            parentsWhatsappNumber: {
                type: String,
                required: true,
            },
            parentsEmail: {
                type: String,
                required: true,
            },
            academicallyResponsiblePerson: {
                type: String,
                required: true,
            },
        },
        academicGuardianInfo: {
            guardianName: {
                type: String,
                required: true,
            },
            relation: {
                type: String,
                required: true,
            },
            guardianMobileNumber: {
                type: String,
                required: true,
            },
            guardianWhatsappNumber: {
                type: String,
            },
            guardianEmail: {
                type: String,
                required: true,
            },
        },

        otherInfo: {
            selectedCourse: {
                type: String,
                required: true,
            },
            studentGroupWhatsappNo: {
                type: String,
                required: true,
            },
            studentGmailId: {
                type: String,
                required: true,
            },
            residentForCourier: {
                type: String,
                required: true,
            },
            typeOfElectronicsToBeUsedInLiveClass: [
                {
                    type: String
                }
            ],
            CoCurricularActivities: [
                {
                    type: String
                }
            ]
        },
        paymentMethod: { type: String, required: true },
        paymentResult: { id: String, status: String, email_address: String },
        itemsPrice: { type: Number, required: true },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.AdmissionForm || mongoose.model('AdmissionForm', admissionFormSchema);
export default User;
