declare module 'sanitize-html' {
	// Local shim to satisfy TS tooling in this repo.
	// The runtime package is installed; this avoids "implicit any" errors.
	const sanitizeHtml: any;
	export default sanitizeHtml;
}

