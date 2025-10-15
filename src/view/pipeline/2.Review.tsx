import { Button, Select, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState, type ReactNode } from "react";
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

type ReviewRow = Cell & { key: string };

const renderEitherCell = <T,>(
	cell: Either<string, T>,
	format?: (value: T) => ReactNode,
): ReactNode => {
	if (cell.isLeft()) {
		return (
			<Typography.Text type="danger">{cell.value || "Ошибка"}</Typography.Text>
		);
	}

	const value = cell.value;

	if (value === null || value === undefined) {
		return null;
	}

	return format ? format(value) : (value as ReactNode);
};

const Review = observer(() => {
	const [pageSize, setPageSize] = useState<number>(20);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const rows = useMemo<ReviewRow[]>(() => {
		if (!store.result || store.result.isLeft()) {
			return [];
		}

		const rows: ReviewRow[] = [];
		for (const [index, outcome] of store.result.value.entries()) {
			if (outcome.isRight()) {
				rows.push({
					key: `${index}-${nanoid()}`,
					value: right(outcome.value.value),
					date: right(outcome.value.date),
					category: right(outcome.value.category),
					comment: right(outcome.value.comment),
					currency: right(outcome.value.currency),
				});
			} else {
				rows.push({
					key: `${index}-${nanoid()}`,
					value: left(outcome.value.fields?.value ?? ""),
					date: left(outcome.value.fields?.date ?? ""),
					category: left(outcome.value.fields?.category ?? ""),
					comment: left(outcome.value.fields?.comment ?? ""),
					currency: left(outcome.value.fields?.currency ?? ""),
				});
			}
		}

		return rows;
	}, [store.result]);

	useEffect(() => {
		const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [rows.length, pageSize, currentPage]);

	const paginationConfig = useMemo(
		() => ({
			current: currentPage,
			pageSize,
			total: rows.length,
			onChange: (page: number) => setCurrentPage(page),
			showSizeChanger: false,
		}),
		[currentPage, pageSize, rows.length],
	);

	const pageSizeOptions = useMemo(() => [10, 20, 50, 100], []);

	const handlePageSizeChange = (size: number) => {
		setPageSize(size);
		setCurrentPage(1);
	};

	const columns = useMemo<TableColumnsType<ReviewRow>>(
		() => [
			{
				title: "Дата",
				dataIndex: "date",
				key: "date",
				render: (cell: ReviewRow["date"]) =>
					renderEitherCell(cell, (value) =>
						value instanceof Date ? value.toLocaleDateString() : String(value),
					),
			},
			{
				title: "Сумма",
				dataIndex: "value",
				key: "value",
				align: "right",
				render: (cell: ReviewRow["value"]) =>
					renderEitherCell(cell, (value) => value.toLocaleString()),
			},
			{
				title: "Категория",
				dataIndex: "category",
				key: "category",
				render: (cell: ReviewRow["category"]) => renderEitherCell(cell),
			},
			{
				title: "Комментарий",
				dataIndex: "comment",
				key: "comment",
				render: (cell: ReviewRow["comment"]) => renderEitherCell(cell),
			},
			{
				title: "Валюта",
				dataIndex: "currency",
				key: "currency",
				render: (cell: ReviewRow["currency"]) => renderEitherCell(cell),
			},
		],
		[],
	);

	return (
		<>
			<div className={styles.paginationControls}>
				<Typography.Text>Записей на странице:</Typography.Text>
				<Select
					value={pageSize}
					style={{ width: 120 }}
					options={pageSizeOptions.map((size) => ({
						value: size,
						label: `${size}`,
					}))}
					onChange={(value) => handlePageSizeChange(Number(value))}
				/>
			</div>
			<Table<ReviewRow>
				columns={columns}
				dataSource={rows}
				pagination={paginationConfig}
				scroll={{ x: true }}
			/>

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
