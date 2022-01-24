import NextLink from "next/link";
import {List, ListItem, ListItemText} from "@mui/material";
import React from "react";

const AdminMenuItems = ({activeItem}) => {
    return (
        <List>
            <NextLink href="/admin/dashboard" passHref>
                <ListItem selected={activeItem === 'dashboard'} button component="a">
                    <ListItemText primary="Admin Dashboard"/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/orders" passHref>
                <ListItem selected={activeItem === 'orders'} button component="a">
                    <ListItemText primary="Orders"/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/products" passHref>
                <ListItem selected={activeItem === 'products'} button component="a">
                    <ListItemText primary="Products"/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/users" passHref>
                <ListItem selected={activeItem === 'users'} button component="a">
                    <ListItemText primary="Users"/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/hero-banner" passHref>
                <ListItem selected={activeItem === 'hero-banners'} button component="a">
                    <ListItemText primary="Hero Banner"/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/why-choose-us" passHref>
                <ListItem selected={activeItem === 'why-choose-us'} button component="a">
                    <ListItemText primary="Why Choose Us"/>
                </ListItem>
            </NextLink>
        </List>
    )
}

export default AdminMenuItems;