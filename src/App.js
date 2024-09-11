import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';

export default function App() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [category, setCategory] = useState('');
    const [totalAmount, handleTotalAmount] = useState(0);
    const [cartProducts, handleCartProducts] = useState([]);

    useEffect(() => {
        axios.get("./data.json")
            .then((response) => {
                setData(response.data);
                setFilteredData(response.data);
            })
            .catch((error) => {
                alert(error.message);
            });
    }, []);

    // Filter data based on search input and category
    useEffect(() => {
        const filterData = () => {
            let updatedData = data;

            if (category) {
                updatedData = updatedData.filter((product) => product.category === category);
            }

            if (searchInput) {
                updatedData = updatedData.filter((product) =>
                    product.name.toLowerCase().includes(searchInput.toLowerCase())
                );
            }

            setFilteredData(updatedData);
        };

        filterData();
    }, [category, searchInput, data]);

    // Handle category change
    const handleCategory = (event) => {
        setCategory(event.target.value);
    };

    // Handle search input change
    const handleSearchInput = (event, value) => {
        setSearchInput(value);
    };

    // const handleAddProduct = (product) => {
    //     let amount = Math.round(totalAmount + product.price);
    //     handleTotalAmount(amount);
    //     handleCartProducts((previousCartProduct) => [...new Set([...previousCartProduct, product])]);
    // };

    const handleAddProduct = (product) => {
        let amount = Math.round(totalAmount + product.price);
        handleTotalAmount(amount);
    
        handleCartProducts((previousCartProducts) => {
            const productExists = previousCartProducts.find((item) => item.id === product.id);
            
            if (productExists) {
                return previousCartProducts.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...previousCartProducts, { ...product, quantity: 1 }];
            }
        });
    };
    

    const handleDeleteProduct = (productToDelete) => {
        let amount = Math.round(totalAmount - productToDelete.price);
        if (amount < 0) {
            amount = 0;
        }
        handleTotalAmount(amount);

        handleCartProducts((previousCartProduct) => (
            previousCartProduct.filter((product) => product.id !== productToDelete.id)
        ));
    }

    return (
        <>
            <div className="container mx-auto pt-4 pb-8">
                <div className="columns-12 px-4 mb-8 flex justify-center">
                    <h1 className="mb-0 text-cyan-950 text-4xl font-medium">E-Commerce</h1>
                </div>

                <div className='flex md:flex-row flex-col px-4 gap-5 mb-5'>
                    <div className="flex-1">
                        <Autocomplete
                            options={data.map((option) => option.name)}
                            inputValue={searchInput}
                            onInputChange={handleSearchInput}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search your Product"
                                    type='search'
                                />
                            )}
                        />
                    </div>

                    <div className="flex-1">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Category"
                                value={category}
                                onChange={handleCategory}
                            >
                                <MenuItem value="">
                                    <span>Select Category</span>
                                </MenuItem>
                                {[...new Set(data.map((product) => product.category))].map((uniqueCategory) => (
                                    <MenuItem key={uniqueCategory} value={uniqueCategory}>
                                        {uniqueCategory}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-8 mb-8">
                    {filteredData.map((product) => (
                        <Card key={product.id} onClick={() => handleAddProduct(product)}>
                            <CardActionArea>
                                <CardMedia
                                    className='max-h-56'
                                    component="img"
                                    image={product.image}
                                    alt={product.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {product.description}
                                    </Typography>
                                    <Typography variant="h6">
                                        {product.price + ' $'}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </div>

                {cartProducts.length > 0 ? (
                    <div>
                        <div className="columns-12 px-4 mb-8 flex justify-center border-t py-5">
                            <h1 className="mb-0 text-cyan-950 text-4xl font-medium">Cart</h1>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-8 mb-8">
                            {cartProducts.map((product) => (
                                <Card key={product.id} className='relative'>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="h6">
                                            {product.price + ' $'}
                                        </Typography>
                                        <Typography variant="h6">
                                            {`Quantity :`}
                                        </Typography>
                                    </CardContent>
                                    <div className="deleteDiv bg-slate-600 cursor-pointer rounded-full absolute top-3 right-3 p-2" onClick={() => handleDeleteProduct(product)}>
                                        <DeleteIcon className='text-white' />
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="columns-12 px-4 mb-8 flex justify-end border-t py-5">
                            <h6 className="mb-0 text-cyan-950 text-2xl font-medium">Total Amount: {totalAmount} $</h6>
                        </div>
                    </div>
                ) : (
                    <div className="columns-12 px-4 mb-8 flex justify-center border-t py-5">
                        <h1 className="mb-0 text-cyan-950 text-4xl font-medium">&nbsp;</h1>
                    </div>
                )}
            </div>
        </>
    );
}
