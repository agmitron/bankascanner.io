import "./App.css";
import React from "react";
import FileUpload from "./FileUpload";
import { I18nProvider } from "./i18n";

function App() {
	return (
		<I18nProvider>
			<div className="App">
				<FileUpload />
			</div>
		</I18nProvider>
	);
}

export default App;
