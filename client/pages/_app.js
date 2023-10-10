import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({Component, pageProps, currentUser}) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <Component {...pageProps} />
        </div>
    );
};

AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx);
    let result;
    try {
        const {data} = await client.get('/api/users/currentuser');
        result = data
    } catch (e) {
        result = null
    }

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {
        pageProps,
        ...result
    };
}
;

export default AppComponent;
