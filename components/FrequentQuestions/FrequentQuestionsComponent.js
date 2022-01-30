import {makeStyles} from '@material-ui/core/styles';
import ExpandMoreIcon from '@mui/icons-material';
import {useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography} from '@mui/material';
import Section from "../common/Section";
import TitleAndSubtitle from "../common/TitleAndSubtitle";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

export default function FrequentQuestions({items, title, subtitle}) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Section>
            <Container>
                {title && <TitleAndSubtitle title={title} subtitle={subtitle} />}
                {items?.map((item, key) => (
                    <Accordion
                        key={key}
                        expanded={expanded === `panel${key}`}
                        onChange={handleChange(`panel${key}`)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${key}bh-content`}
                            id={`panel${key}bh-header`}>
                            <Typography className={classes.heading} component="h4">
                                {item?.title}
                            </Typography>
                            {item?.subtitle && (
                                <Typography
                                    className={classes.secondaryHeading}
                                    component="span">
                                    {item?.subtitle}
                                </Typography>
                            )}
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box>{item?.content}</Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>
        </Section>
    );
}
