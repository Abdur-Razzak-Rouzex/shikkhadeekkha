import NextLink from "next/link";
import {List, ListItem, ListItemText} from "@mui/material";
import React from "react";
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import InfoIcon from '@mui/icons-material/Info';
import MessageIcon from '@mui/icons-material/Message';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';

const AdminMenuItems = ({activeItem}) => {
    return (
        <List>
            <NextLink href="/admin/dashboard" passHref>
                <ListItem selected={activeItem === 'dashboard'} button component="a">
                    <ListItemText primary="Dashboard"/>
                    <DashboardIcon/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/admissions" passHref>
                <ListItem selected={activeItem === 'admission'} button component="a">
                    <ListItemText primary="Admissions"/>
                    <SchoolIcon/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/orders" passHref>
                <ListItem selected={activeItem === 'orders'} button component="a">
                    <ListItemText primary="Orders"/>
                    <ShoppingCartIcon/>
                </ListItem>
            </NextLink>
            {/*<NextLink href="/admin/products" passHref>
                <ListItem selected={activeItem === 'products'} button component="a">
                    <ListItemText primary="Products"/>
                    <ProductionQuantityLimitsIcon/>
                </ListItem>
            </NextLink>*/}
            <NextLink href="/admin/users" passHref>
                <ListItem selected={activeItem === 'users'} button component="a">
                    <ListItemText primary="Users"/>
                    <SupervisedUserCircleIcon/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/hero-banner" passHref>
                <ListItem selected={activeItem === 'hero-banners'} button component="a">
                    <ListItemText primary="Hero Banner"/>
                    <ViewCarouselIcon/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/why-choose-us" passHref>
                <ListItem selected={activeItem === 'why-choose-us'} button component="a">
                    <ListItemText primary="Why Choose Us"/>
                    <InfoIcon/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/testimonial" passHref>
                <ListItem selected={activeItem === 'testimonials'} button component="a">
                    <ListItemText primary="Testimonial"/>
                    <MessageIcon/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/faq" passHref>
                <ListItem selected={activeItem === 'faqs'} button component="a">
                    <ListItemText primary="FAQs"/>
                    <HelpCenterIcon/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/category" passHref>
                <ListItem selected={activeItem === 'category'} button component="a">
                    <ListItemText primary="Categories"/>
                    <CategoryIcon/>
                </ListItem>
            </NextLink>
            <NextLink href="/admin/courses" passHref>
                <ListItem selected={activeItem === 'courses'} button component="a">
                    <ListItemText primary="Courses"/>
                    <CastForEducationIcon/>
                </ListItem>
            </NextLink>
        </List>
    )
}

export default AdminMenuItems;