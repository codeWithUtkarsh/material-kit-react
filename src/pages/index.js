import Head from 'next/head';
import { Box, Container, Grid, Typography, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import React, { useState } from 'react';
import JSZip from 'jszip';
import { BlobServiceClient } from '@azure/storage-blob';
import { Select, MenuItem } from '@mui/material';

const Page = () => {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSubmit = async (data) => {
    // Perform actions with form data (e.g., send to server)
    

    // Create a new JSZip instance
    const zip = new JSZip();

    const addBlobsToZip = async (d) => {
      // Initialize Azure Storage Blob Service Client
      console.log('Form submitted with data:', d);
    
      const blobServiceClient = BlobServiceClient.fromConnectionString('BlobEndpoint=https://utkarshdemorg8b53.blob.core.windows.net/;QueueEndpoint=https://utkarshdemorg8b53.queue.core.windows.net/;FileEndpoint=https://utkarshdemorg8b53.file.core.windows.net/;TableEndpoint=https://utkarshdemorg8b53.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2025-11-26T00:55:50Z&st=2023-11-25T16:55:50Z&spr=https,http&sig=zSAsd2SMD86z3a9EPpvMa%2Bxhe9%2B828nLhkhlD3h5iw0%3D');
      const containerClient = blobServiceClient.getContainerClient('demo-project');
      const parent = d['language']
      const child = d['description']
    
      const downloadPromises = [];
    
      for await (const blob of containerClient.listBlobsFlat()) {
        const blobArr = blob.name.split('/');
    
        console.log('Form submitted with data:', blobArr[0] == parent && child.includes(blobArr[1]));
        if (blobArr[0] == parent && child.includes(blobArr[1])) {
          const blobClient = containerClient.getBlobClient(blob.name);
          // const downloadPromise = blobClient.downloadToBuffer().then((blobContent) => {
          //   zip.file(blob.name, blobContent);
          // });

          const downloadPromise = blobClient.downloadToBuffer().then((blobContent) => {
            console.log('Blob Content:', blobContent);
            // zip.file(blob.name, blobContent);
            zip.file(blob.name, blobContent, { binary: true});

          });
    
          downloadPromises.push(downloadPromise);
        }
      }
    
      // Wait for all blob downloads to complete
      await Promise.all(downloadPromises);
    };

    // Call the async function to add blobs to the zip
    await addBlobsToZip(data);

    const generatedBlob = await zip.generateAsync({ type: 'blob' });
    
    // Trigger download of the generated zip file
    const url = window.URL.createObjectURL(generatedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setRefreshKey((prevKey) => prevKey + 1);
    
  };

  return (
    <Container>
      <Head>
        <title>Playground</title>
      </Head>
      <Box mt={3}>
        <Typography variant="h4" gutterBottom>
          Enter your project details
        </Typography>
        <MyForm key={refreshKey} onSubmit={handleFormSubmit} />
      </Box>
    </Container>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

// Form component
const MyForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    groupId: '',
    artifactId: '',
    packageName: '',
    description: '',
    version: '',
    packaging: '',
    javaVersion: '',
    language: '',
    dependencies: [],
    generateZip: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleDependenciesChange = (dependency) => {
    const dependencies = formData.dependencies.includes(dependency)
      ? formData.dependencies.filter((item) => item !== dependency)
      : [...formData.dependencies, dependency];

    setFormData({ ...formData, dependencies });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="GroupID"
            variant="outlined"
            fullWidth
            margin="normal"
            name="groupId"
            value={formData.groupId}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Project Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="artifactId"
            value={formData.artifactId}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Package Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="packageName"
            value={formData.packageName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Describe your application"
            variant="outlined"
            fullWidth
            margin="normal"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Version"
            variant="outlined"
            fullWidth
            margin="normal"
            name="version"
            value={formData.version}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Packaging"
            variant="outlined"
            fullWidth
            margin="normal"
            name="packaging"
            value={formData.packaging}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Programming Language"
            variant="outlined"
            fullWidth
            margin="normal"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Dependencies
          </Typography>
          <Select label="Select Dependencies"
            fullWidth
            single
            value={formData.dependencies}
            onChange={(e) => handleDependenciesChange(e.target.value)}
            renderValue={(selected) => selected.join(', ')}
          >
            <MenuItem value="">Select Dependencies</MenuItem>
            <MenuItem value="Spring Web">Spring Web</MenuItem>
            <MenuItem value="request">Request</MenuItem>
            <MenuItem value="Hibernate">Hibernate</MenuItem>

            {/* Add more dependencies as needed */}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.generateZip}
                onChange={handleCheckboxChange}
                name="generateZip"
              />
            }
            label="Generate as Zip"
          />
        </Grid>
      </Grid>
      <Box mt={2} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" type="submit">
          Generate Project
        </Button>
      </Box>
    </form>
  );
};

export default Page;
