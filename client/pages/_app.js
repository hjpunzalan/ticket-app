import "bootstrap/dist/css/bootstrap.css"; // can only import global css here at app file

export default ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};
