import mongoose, { Document, model, Schema } from "mongoose";


export interface IUser extends Document {
    name: string;
    email: string;
    image: string;
    instrgram: string; // Note: typo - should be "instagram"
    facebook: string;
    linkedin: string;
    bio: string;
}

// const schema: Schema<IUser> = new Schema({
//     name: {
//         type: String,
//         required: [true, 'Name is required'],
//         trim: true,
//         maxlength: [50, 'Name cannot exceed 50 characters']
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//         unique: true,
//         lowercase: true,
//         trim: true,
//         match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//     },
//     image: {
//         type: String,
//         default: '',
//         validate: {
//             validator: function(v: string) {
//                 // Basic URL validation (optional)
//                 return v === '' || /^https?:\/\/.+\..+/.test(v);
//             },
//             message: 'Please provide a valid image URL'
//         }
//     },
//     instrgram: {
//         type: String,
//         default: '',
//         validate: {
//             validator: function(v: string) {
//                 return v === '' || /^https?:\/\/(www\.)?instagram\.com\/.+/.test(v);
//             },
//             message: 'Please provide a valid Instagram URL'
//         }
//     },
//     facebook: {
//         type: String,
//         default: '',
//         validate: {
//             validator: function(v: string) {
//                 return v === '' || /^https?:\/\/(www\.)?facebook\.com\/.+/.test(v);
//             },
//             message: 'Please provide a valid Facebook URL'
//         }
//     },
//     linkedin: {
//         type: String,
//         default: '',
//         validate: {
//             validator: function(v: string) {
//                 return v === '' || /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(v);
//             },
//             message: 'Please provide a valid LinkedIn URL'
//         }
//     },
//     bio: {
//         type: String,
//         default: '',
//         maxlength: [500, 'Bio cannot exceed 500 characters'],
//         trim: true
//     }
// }, {
//     timestamps: true // Adds createdAt and updatedAt automatically
// });

// // Optional: Add indexes for better query performance
// schema.index({ email: 1 });
// schema.index({ name: 1 });



// alternative simplified version of schema
const schema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    instrgram: {
        type: String,
        default: ''
    },
    facebook: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: '',
        maxlength: 500
    }
}, {
    timestamps: true
});

const User = mongoose.model<IUser>("User", schema)
export default User;