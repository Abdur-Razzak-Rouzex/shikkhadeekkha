import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Layout from "../../components/Layout";
import db from "../../utils/db";
import WhyChooseUs from "../../models/WhyChooseUs";
import AboutUsDetailsComponent from "../../components/about-us/AboutUsDetailsComponent";

export default function Home(props) {
    const {whyChooseUsData} = props;

    return (
        <Layout>
            {whyChooseUsData?.isFlipBook ? (
                <iframe
                    allowFullScreen={true}
                    scrolling='no'
                    className='fp-iframe'
                    src={whyChooseUsData?.flipBookLink}
                    style={{border: '1px solid lightgray', width: '100%', height: '600px'}}
                />
            ) : (
                <AboutUsDetailsComponent whyChooseUsData={whyChooseUsData} />
            )}
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const id = context.query.id;
    await db.connect();

    const whyChooseUsDoc = await WhyChooseUs.findById(id)
        .lean()

    return {
        props: {
            whyChooseUsData: db.convertDocToObj(whyChooseUsDoc),
        },
    };
}
