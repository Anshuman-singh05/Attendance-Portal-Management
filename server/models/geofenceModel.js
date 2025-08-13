import mongoose from 'mongoose';

const geofenceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  center: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true,
    },
  },
  radius: { // Radius in meters
    type: Number,
    required: true,
  },
}, { timestamps: true });

// GeoJSON queries ke liye index
geofenceSchema.index({ center: '2dsphere' });

const Geofence = mongoose.model('Geofence', geofenceSchema);
export default Geofence;