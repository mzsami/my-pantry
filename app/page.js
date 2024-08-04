'use client'
import { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Stack, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

// Main functionality
export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { name: item, quantity: 1 });
    }
    
    await updateInventory(); // Ensure inventory is updated after adding an item
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    
    await updateInventory(); // Ensure inventory is updated after adding an item
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Basic UI
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
        </Toolbar>
      </AppBar>
      
      {/* Main content */}
      <Box 
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mt={2}
      >
        {/* Adding Items */}
        <Modal open={open} onClose={handleClose}>
          <Box
            position='absolute' 
            top="50%" 
            left="50%"
            transform="translate(-50%, -50%)"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField 
                variant='outlined'
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add 
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Button
          variant='contained'
          color='primary'
          onClick={handleOpen}
        >
          Add New Item
        </Button>

        <Box border="1px solid #333" mt={2}>
          <Box 
            width="800px" 
            height="100px"
            bgcolor="#ADD8E6" 
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <Typography variant="h2" color = "#333">
              Inventory Items
            </Typography>
          </Box>

          <Stack width='800px' height='300px' spacing={2} overflow="auto">
            {inventory.map(({name, quantity}) => (
              <Box 
                key={name} 
                width='100%' 
                minHeight='150px' 
                display='flex'
                alignItems='center' 
                justifyContent='space-between' 
                bgcolor='#f0f0f0' 
                padding={5}
              >
                <Typography variant='h3' color="#333" textAlign="center">
                  {name ? name[0].toUpperCase() + name.slice(1) : ''}
                </Typography>
                <Typography variant='h3' color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction='row' spacing={2}>
                  <Button variant='contained' onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button variant='contained' onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
          width: '100%',
          textAlign: 'center'
        }}
      >
        <Typography variant="body1">
          Sami © {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Built with Material-UI
        </Typography>
      </Box>
    </Box>
  )
}


