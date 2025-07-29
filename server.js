const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

// ✅ Firebase Admin SDK
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://busdriverlogin-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const firebaseDB = admin.database();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve HTML pages

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Save live bus location to Firebase
app.post('/api/firebase/location', async (req, res) => {
  const { busId, lat, lng } = req.body;

  if (!busId || lat == null || lng == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await firebaseDB.ref(`live_locations/${busId}`).set({
      lat,
      lng,
      timestamp: new Date().toISOString()
    });

    res.json({ message: '✅ Location updated in Firebase Realtime DB' });
  } catch (err) {
    console.error('❌ Firebase DB update failed:', err.message);
    res.status(500).json({ error: 'Firebase write error' });
  }
});




// ✅ User registration in Firebase
app.post('/api/users', async (req, res) => {
  const {
    user_name,
    password,
    full_name,
    email,
    phone_number,
    profile_picture
  } = req.body;

  if (!user_name || !password || !full_name || !email) {
    return res.status(400).json({ error: 'Missing required user fields' });
  }

  try {
    // Reference user by username
    const userRef = firebaseDB.ref(`users/${user_name}`);
    const userSnapshot = await userRef.once('value');

    if (userSnapshot.exists()) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password and assign unique userId
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;

    // Save user in Firebase
    await userRef.set({
      userId,
      user_name,
      password: hashedPassword,
      full_name,
      email,
      phone_number: phone_number || '',
      profile_picture: profile_picture || '',
      role: 'driver',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.json({ message: '✅ User registered', userId });
  } catch (err) {
    console.error('❌ User registration error:', err.message);
    res.status(500).json({ error: 'Server error during user registration' });
  }
});

// ✅ User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Get user by username
    const userSnap = await firebaseDB.ref(`users/${username}`).once('value');
    const user = userSnap.val();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Check if driver info exists
    const driverSnap = await firebaseDB.ref(`drivers/${user.userId}`).once('value');
    const driver = driverSnap.val();

    res.json({
      message: '✅ Login successful',
      userId: user.userId,
      driverId: driver ? driver.driverId : null
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


// ========================
// DEBUGGING & DRIVER TESTING
// ========================

// Debugging: Log received userId and handle driver creation
// ✅ Add driver to Firebase
app.post('/api/drivers', async (req, res) => {
  const { driverId, userId, busId, routeId, status, current_location, last_update } = req.body;

  if (!driverId || !userId || !busId || !routeId) {
    console.log('❌ Missing required fields for driver:', req.body);
    return res.status(400).json({ error: 'Missing required driver fields' });
  }

  try {
    console.log("✅ Received userId from frontend:", userId);

    const driverRef = firebaseDB.ref(`drivers/${userId}`); // userId as key
    const driverSnapshot = await driverRef.once('value');

    if (driverSnapshot.exists()) {
      return res.status(400).json({ error: 'Driver already exists for this user' });
    }

    await driverRef.set({
      driverId,
      userId,
      busId,
      routeId,
      status: status || 'on_time',
      current_location: current_location || 'unknown',
      last_update: last_update || new Date().toISOString()
    });

    res.json({ message: '✅ Driver added successfully' });
  } catch (err) {
    console.error('❌ Error adding driver:', err.message);
    res.status(500).json({ error: 'Failed to add driver' });
  }
});


// ========================
// LOGIN
// ========================

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await db.collection('users').findOne({ user_name: username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

  const driver = await db.collection('drivers').findOne({ userId: user.userId });

  res.json({
    message: 'Login successful',
    userId: user.userId,
    driverId: driver ? driver.driverId : null
  });
});









// ffffffffffff

app.post('/api/users', async (req, res) => {
  const { user_name, password, full_name, email, phone_number, profile_picture } = req.body;

  if (!user_name || !password || !full_name || !email) {
    return res.status(400).json({ error: 'Missing required user fields' });
  }

  try {
    const userRef = firebaseDB.ref(`users/${user_name}`);
    const snapshot = await userRef.once('value');
    if (snapshot.exists()) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;

    await userRef.set({
      userId,
      user_name,
      password: hashedPassword,
      full_name,
      email,
      phone_number: phone_number || '',
      profile_picture: profile_picture || '',
      role: 'driver',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.json({ message: '✅ User registered', userId });
  } catch (err) {
    console.error('❌ User registration error:', err.message);
    res.status(500).json({ error: 'Server error during user registration' });
  }
});


app.post('/api/buses', async (req, res) => {
  const { bus_number, plate_number, capacity, model, userId, routeId } = req.body;

  if (!bus_number || !plate_number || !capacity || !model || !userId || !routeId) {
    return res.status(400).json({ error: 'Missing required bus fields' });
  }

  try {
    const busesRef = firebaseDB.ref('buses');
    const snapshot = await busesRef.orderByChild('plate_number').equalTo(plate_number).once('value');

    if (snapshot.exists()) {
      return res.status(409).json({ error: 'Bus with this plate number already exists' });
    }

    const busId = `bus_${Date.now()}`;
    await firebaseDB.ref(`buses/${busId}`).set({
      busId,
      bus_number,
      plate_number,
      capacity,
      model,
      userId,
      routeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.json({ message: '✅ Bus added successfully', busId });
  } catch (err) {
    console.error('❌ Error adding bus:', err.message);
    res.status(500).json({ error: 'Failed to add bus' });
  }
});


app.post('/api/routes', async (req, res) => {
  try {
    const { routeId, route_name, route_description, userId } = req.body;

    if (!routeId || !route_name || !userId) {
      return res.status(400).json({ error: 'Missing required route fields' });
    }

    const existing = await db.collection('routes').findOne({ routeId });
    if (existing) {
      return res.status(409).json({ error: 'Route ID already exists' });
    }

    const result = await db.collection('routes').insertOne({
      routeId,
      route_name,
      route_description,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ message: '✅ Route added successfully', insertedId: result.insertedId });
  } catch (err) {
    console.error('Error adding route:', err.message);
    res.status(500).json({ error: 'Failed to add route' });
  }
});


app.get('/api/buses/search', async (req, res) => {
  const { plate_number } = req.query;
  if (!plate_number) return res.status(400).json({ error: 'Missing plate_number query param' });

  const buses = await db.collection('buses').find({ plate_number }).toArray();
  res.json(buses);
});


app.get('/api/routes/search', async (req, res) => {
  const { route_id } = req.query;
  if (!route_id) return res.status(400).json({ error: 'Missing route_id query param' });

  const routes = await db.collection('routes').find({ routeId: route_id }).toArray();
  res.json(routes);
});


app.get('/api/drivers/searchByUser', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId query param' });

  const driver = await db.collection('drivers').findOne({ userId });
  res.json({ driver });
});

// ===================== Driver, Bus, and Route Lookup APIs =====================

// Search for driver by userId
app.get('/api/drivers/searchByUser', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const driver = await db.collection('drivers').findOne({ userId });
    if (driver) return res.json({ driver });
    res.json({ driver: null });
  } catch (err) {
    console.error("Error finding driver by userId:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search for bus by userId
app.get('/api/buses/searchByUser', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const bus = await db.collection('buses').findOne({ userId });
    if (bus) return res.json({ bus });
    res.json({ bus: null });
  } catch (err) {
    console.error("Error finding bus by userId:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search for route by userId
app.get('/api/routes/searchByUser', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const route = await db.collection('routes').findOne({ userId });
    if (route) return res.json({ route });
    res.json({ route: null });
  } catch (err) {
    console.error("Error finding route by userId:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


// track driver 

app.post('/api/location/update', async (req, res) => {
  const { busId, lat, lng } = req.body;

  if (!busId || !lat || !lng) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await db.collection('bus_location_history').insertOne({
      busId,
      latitude: lat,
      longitude: lng,
      timestamp: new Date()
    });

    res.json({ message: 'Location updated successfully' });
  } catch (err) {
    console.error('Error updating location:', err.message);
    res.status(500).json({ error: 'Failed to update location' });
  }
});


// POST: Update bus location (with duplicate check)
app.post('/api/location/update', async (req, res) => {
  const { userId, driverId, busId, routeId, lat, lng } = req.body;

  if (!userId || !driverId || !busId || !routeId || lat == null || lng == null) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const busCollection = db.collection('bus_location_history');

    // Check if the last recorded location is the same
    const lastLocation = await busCollection.findOne(
      { busId },
      { sort: { timestamp: -1 } }
    );

    if (
      lastLocation &&
      lastLocation.lat === lat &&
      lastLocation.lng === lng
    ) {
      return res.status(200).json({ message: 'Location unchanged. Not saved again.' });
    }

    // Save new location only if changed
    await busCollection.insertOne({
      userId,
      driverId,
      busId,
      routeId,
      lat,
      lng,
      timestamp: new Date()
    });

    res.json({ message: '✅ Location updated successfully.' });
  } catch (err) {
    console.error('Error saving location:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ✅ API to insert location and delete oldest if more than 2 (MongoDB logic)
// server.js

app.post('/api/location/update', async (req, res) => {
  const { userId, driverId, busId, routeId, lat, lng } = req.body;

  if (!userId || !driverId || !busId || !routeId || lat == null || lng == null) {
    return res.status(400).json({ error: '❌ Missing required data' });
  }

  try {
    const collection = db.collection('location_history');

    // 1. Insert new location entry
    await collection.insertOne({
      userId,
      driverId,
      busId,
      routeId,
      latitude: lat,
      longitude: lng,
      timestamp: new Date()
    });

    // 2. Delete older entries, keep only latest 2 for the bus
    const extraDocs = await collection
      .find({ busId })
      .sort({ timestamp: -1 }) // Newest first
      .skip(2) // Skip top 2
      .toArray();

    const idsToDelete = extraDocs.map(doc => doc._id);
    if (idsToDelete.length > 0) {
      await collection.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.json({ message: '✅ Location updated. Extra entries cleared.' });
  } catch (err) {
    console.error("❌ DB update failed:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get all routes
app.get('/api/routes/all', async (req, res) => {
  try {
    const routes = await db.collection('routes').find().toArray();
    res.json(routes);
  } catch (err) {
    console.error("Error fetching all routes:", err);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

// Get route by ID
app.get('/api/routes/byId', async (req, res) => {
  const { routeId } = req.query;
  if (!routeId) return res.status(400).json({ error: "Missing routeId" });

  try {
    const route = await db.collection('routes').findOne({ routeId });
    res.json(route || {});
  } catch (err) {
    console.error("Error fetching route by ID:", err);
    res.status(500).json({ error: "Failed to fetch route" });
  }
});


// Get all buses for a given route
app.get('/api/buses/byRoute', async (req, res) => {
  const { routeId } = req.query;
  if (!routeId) return res.status(400).json({ error: 'Missing routeId' });

  try {
    const buses = await db.collection('buses').find({ routeId }).toArray();
    res.json(buses);
  } catch (err) {
    console.error("Error fetching buses by routeId:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
