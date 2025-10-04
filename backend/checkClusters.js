import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Cluster from './models/Cluster.js';

dotenv.config();

async function checkClusters() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Check if clusters collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const clusterCollectionExists = collections.some(col => col.name === 'clusters');
    console.log('Clusters collection exists:', clusterCollectionExists);

    // Count clusters
    const clusterCount = await Cluster.countDocuments();
    console.log('Total clusters in database:', clusterCount);

    // List all clusters
    const clusters = await Cluster.find();
    console.log('\n📊 All clusters:');
    clusters.forEach(cluster => {
      console.log(`- ${cluster.name} (ID: ${cluster.clusterId})`);
    });

    // Check specific cluster
    const ncrCluster = await Cluster.findOne({ clusterId: 'ncr_students' });
    console.log('\n🔍 NCR Students cluster:', ncrCluster ? 'FOUND' : 'NOT FOUND');

    if (!ncrCluster) {
      console.log('❌ Cluster not found. Creating demo clusters...');
      await createDemoClusters();
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking clusters:', error);
    process.exit(1);
  }
}

async function createDemoClusters() {
  const demoClusters = [
    {
      clusterId: 'ncr_students',
      name: 'NCR Students',
      memberCount: 47,
      demographics: {
        avgBudget: 3200,
        commonSituations: ['student']
      }
    },
    {
      clusterId: 'davao_families',
      name: 'Davao Families', 
      memberCount: 23,
      demographics: {
        avgBudget: 8000,
        commonSituations: ['family']
      }
    },
    {
      clusterId: 'cebu_professionals',
      name: 'Cebu Professionals',
      memberCount: 34,
      demographics: {
        avgBudget: 15000,
        commonSituations: ['professional']
      }
    }
  ];

  try {
    await Cluster.insertMany(demoClusters);
    console.log('✅ Demo clusters created successfully!');
    
    // Verify creation
    const newClusters = await Cluster.find();
    console.log('New cluster count:', newClusters.length);
  } catch (error) {
    console.error('Error creating demo clusters:', error);
  }
}

checkClusters();