'use client'
import { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Stack, Modal, TextField, InputBase, Paper } from '@mui/material'
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

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
    
    await updateInventory();
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
    
    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#2F4F4F',
        px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
      }}
    >
      <AppBar position="static" sx={{ bgcolor: '#3E2723' }}>
        <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white', textAlign: { xs: 'center', sm: 'left' } }}>
            🥕 MyPantry
          </Typography>
          <Button color="inherit" sx={{ color: 'white' }} onClick={() => document.getElementById('inventory-section').scrollIntoView({ behavior: 'smooth' })}>
            Inventory
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box 
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mt={2}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} // Responsive direction
          spacing={2} 
          alignItems="center" 
          sx={{ bgcolor: '#3E2723', padding: '1em', borderRadius: '10px', width: '100%', maxWidth: '800px' }} // Responsive width
        >
          <Paper
            component="form"
            sx={{ display: 'flex', alignItems: 'center', width: '100%', borderRadius: 1, padding: '0.5em', bgcolor: '#3E2723' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, color: 'white' }}
              placeholder="Search Inventory"
              inputProps={{ 'aria-label': 'search inventory' }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Paper>

          <Button
            variant='contained'
            sx={{
              bgcolor: '#388E3C',
              color: 'white',
              transition: 'all 0.3s ease-in-out',
              width: { xs: '100%', sm: 'auto' }, // Responsive width for button
              '&:hover': {
                bgcolor: '#66BB6A',
                transform: 'scale(1.1)',
                boxShadow: '0px 0px 20px rgba(102, 187, 106, 0.5)',
              },
            }}
            onClick={handleOpen}
          >
            Add New Item
          </Button>
        </Stack>

        <Modal open={open} onClose={handleClose}>
          <Box
            position='absolute' 
            top="50%" 
            left="50%"
            transform="translate(-50%, -50%)"
            width={{ xs: '90%', sm: 400 }} // Responsive width
            bgcolor="#4E342E"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Typography variant="h6" sx={{ color: 'white' }}>Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField 
                variant='outlined'
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } }, '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: 'white' }}}
              />
              <Button
                variant='contained'
                sx={{
                  bgcolor: '#388E3C',
                  color: 'white',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    bgcolor: '#66BB6A',
                    transform: 'scale(1.1)',
                    boxShadow: '0px 0px 20px rgba(102, 187, 106, 0.5)',
                  },
                }}
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

        <Box 
          id="inventory-section"
          border="1px solid #3E2723" 
          mt={2} 
          width="100%" 
          maxWidth="800px" // Responsive max width
          borderRadius="10px"
        > 
          <Box 
            height="100px"
            bgcolor="#4E342E"
            display='flex'
            alignItems='center'
            justifyContent='center'
            borderTopLeftRadius="10px"
            borderTopRightRadius="10px"
          >
            <Typography variant="h2" sx={{ color: 'white', fontSize: { xs: '1.5rem', sm: '2rem' } }}> {/* Responsive font size */}
              Inventory Items
            </Typography>
          </Box>

          <Stack width='100%' height={{ xs: 'auto', sm: '300px' }} spacing={2} overflow="auto" sx={{ padding: 2 }}>
            {filteredInventory.map(({name, quantity}) => (
              <Box 
                key={name} 
                width='100%' 
                minHeight='150px' 
                display='flex'
                alignItems='center' 
                justifyContent='space-between' 
                bgcolor='#3E2723'
                padding={5}
                borderRadius="10px"
                sx={{ flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }} // Responsive flex direction and text alignment
              >
                <Typography variant='h3' sx={{ color: 'white', fontSize: { xs: '1.25rem', sm: '1.75rem' } }}>
                  {name ? name[0].toUpperCase() + name.slice(1) : ''}
                </Typography>
                <Typography variant='h3' sx={{ color: 'white', fontSize: { xs: '1.25rem', sm: '1.75rem' } }}>
                  {quantity}
                </Typography>
                <Stack direction='row' spacing={2} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}> {/* Responsive width and alignment */}
                  <Button 
                    variant='contained' 
                    sx={{
                      bgcolor: '#388E3C',
                      color: 'white',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        bgcolor: '#66BB6A',
                        transform: 'scale(1.1)',
                        boxShadow: '0px 0px 20px rgba(102, 187, 106, 0.5)',
                      },
                      width: { xs: '100%', sm: 'auto' }, // Responsive button width
                    }} 
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>
                  <Button 
                    variant='contained' 
                    sx={{
                      bgcolor: '#388E3C',
                      color: 'white',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        bgcolor: '#66BB6A',
                        transform: 'scale(1.1)',
                        boxShadow: '0px 0px 20px rgba(102, 187, 106, 0.5)',
                      },
                      width: { xs: '100%', sm: 'auto' }, // Responsive button width
                    }} 
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#3E2723',
          color: 'white',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' }, // Responsive flex direction
          textAlign: 'left',
        }}
      >
        <Typography variant="body1" sx={{ mb: { xs: 1, sm: 0 } }}> {/* Responsive margin bottom */}
          MyPantry © {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" sx={{ color: 'white' }}>
          GitHub: mzsami
        </Typography>
      </Box>
    </Box>
  )
}





