import { Button } from "antd";
import { observer } from "mobx-react-lite";
import styles from "../../FileUpload.module.css";
import store from "./Pipeline.store";

const Review = observer(() => (
	<>
		<div className={styles.uploadArea}>
			<h3>Обработка документа...</h3>
		</div>

		<div className={styles.buttonContainer}>
			<Button onClick={store.previous}>Previous Page</Button>
			<Button type="primary" onClick={store.next}>
				Continue
			</Button>
		</div>
	</>
));

export default Review;
