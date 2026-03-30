import mongoose  from 'mongoose'
import bcrypt    from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role:     { type: String, enum: ['admin', 'editor'], default: 'editor' },
    avatar:   { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.matchPassword = async function (plainText) {
  return bcrypt.compare(plainText, this.password)
}

export default mongoose.model('User', userSchema)
