import { Button } from "antd";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import store from "./Pipeline.store";
import styles from "./Review.module.css";
import { nanoid } from "nanoid";
import { left, right, type Either } from "bankascanner/lib/either";

interface Cell {
	date: Either<string, Date>;
	value: Either<string, number>;
	category: Either<string, string>;
	comment: Either<string, string>;
	currency: Either<string, string>;
}

const Review = observer(() => {
	const rows = useMemo(() => {
		if (!store.result || store.result.isLeft()) {
			return [];
		}

		const rows: Cell[] = [];
		for (const outcome of store.result.value) {
			if (outcome.isRight()) {
				rows.push({
					value: right(outcome.value.value),
					date: right(outcome.value.date),
					category: right(outcome.value.category),
					comment: right(outcome.value.comment),
					currency: right(outcome.value.currency),
				});
			} else {
				rows.push({
					value: left(outcome.value.fields?.value ?? ""),
					date: left(outcome.value.fields?.date ?? ""),
					category: left(outcome.value.fields?.category ?? ""),
					comment: left(outcome.value.fields?.comment ?? ""),
					currency: left(outcome.value.fields?.currency ?? ""),
				});
			}
		}
	}, [store.result]);

	return (
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
	);
});

export default Review;
