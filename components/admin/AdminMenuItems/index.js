import NextLink from "next/link";
import {List, ListItem, ListItemText} from "@mui/material";
import React from "react";

const AdminMenuItems = ({activeItem}) => {
    return (
        <List>
            <NextLink href="/admin/dashboard" passHref>
                <ListItem selected={activeItem === 'dashboard'} button component="a">
                    <ListItemText primary="Dashboard"/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/admissions" passHref>
                <ListItem selected={activeItem === 'admission'} button component="a">
                    <ListItemText primary="Admissions"/>
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
            <NextLink href="/admin/testimonial" passHref>
                <ListItem selected={activeItem === 'testimonials'} button component="a">
                    <ListItemText primary="Testimonial"/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/faq" passHref>
                <ListItem selected={activeItem === 'faqs'} button component="a">
                    <ListItemText primary="FAQs"/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/category" passHref>
                <ListItem selected={activeItem === 'category'} button component="a">
                    <ListItemText primary="Categories"/>
                </ListItem>
            </NextLink>
        </List>
    )
}

export default AdminMenuItems;