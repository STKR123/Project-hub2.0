const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://ajvonlwnhsnmwjcidukb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdm9ubHduaHNubXdqY2lkdWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODEwOTMsImV4cCI6MjA1OTc1NzA5M30.UZIAB1j2ZsKYNDLUrr08_NbzbLUzeuQWYacdaIcECz8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the data.json file and evaluate it as JavaScript
const fileContent = fs.readFileSync('./data.json', 'utf8');

// Create a function to safely evaluate the JavaScript content
function getProjects() {
  let projects;
  eval(fileContent); // This will set the 'projects' variable
  return projects;
}

// Get the projects array
const projects = getProjects();

async function importData() {
  console.log(`Found ${projects.length} projects to import...`);
  
  // Create batches of 50 projects each to avoid hitting rate limits
  const batchSize = 50;
  const batches = [];
  
  for (let i = 0; i < projects.length; i += batchSize) {
    batches.push(projects.slice(i, i + batchSize));
  }
  
  console.log(`Created ${batches.length} batches for import`);
  
  // Process each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i+1}/${batches.length} with ${batch.length} projects`);
    
    const { data, error } = await supabase
      .from('projects')
      .insert(batch);
    
    if (error) {
      console.error(`Error importing batch ${i+1}:`, error);
    } else {
      console.log(`Successfully imported batch ${i+1}`);
    }
  }
  
  console.log('Import completed!');
}

importData().catch(console.error);
