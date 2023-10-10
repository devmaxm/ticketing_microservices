import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {
    return currentUser ? (
        <h1>You are signed in</h1>
    ) : (
        <h1>You are NOT signed in</h1>
    );
};

LandingPage.getInitialProps = async context => {
    console.log('LANDING PAGE!');
    const client = buildClient(context);

    let result;
    try {
        const {data} = await client.get('/api/users/currentuser');
        result = data
    } catch (e) {
        result = null
    }
    return result
};

export default LandingPage;
