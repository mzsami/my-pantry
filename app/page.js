'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, query, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]); // Inventory should be an array
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id, // Added an ID for the key
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
      await setDoc(docRef, { quantity: 1 });
    }
    
    await updateInventory(); // Ensure inventory is updated after adding an item
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      height="100vh" 
      width="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
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
              variant='outlined'
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
      <Typography variant='h1'>Inventory Management</Typography>
      <Box>
        {inventory.map((item) => (
          <Box key={item.id} p={2} border={1} borderRadius={1}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body1">Quantity: {item.quantity}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

