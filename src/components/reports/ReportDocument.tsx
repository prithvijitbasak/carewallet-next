import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

interface ExpenseReportItem {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

interface ReportDocumentProps {
  expenses: ExpenseReportItem[];
  startDate: string;
  endDate: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 24,
  },
  header: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 11,
    marginBottom: 16,
    textAlign: "center",
    color: "#555",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: 6,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 6,
    fontSize: 9,
    textAlign: "center",
  },
});

const ReportDocument: React.FC<ReportDocumentProps> = ({
  expenses,
  startDate,
  endDate,
}) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>PB Expense Report</Text>
        <Text style={styles.subHeader}>
          Period: {startDate} to {endDate}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Title</Text>
            <Text style={styles.tableColHeader}>Amount (₹)</Text>
            <Text style={styles.tableColHeader}>Category</Text>
            <Text style={styles.tableColHeader}>Date</Text>
            <Text style={styles.tableColHeader}>Notes</Text>
          </View>
          {expenses.map((expense, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{expense.title}</Text>
              <Text style={styles.tableCol}>₹{Number(expense.amount).toFixed(2)}</Text>
              <Text style={styles.tableCol}>{expense.category}</Text>
              <Text style={styles.tableCol}>{expense.date}</Text>
              <Text style={styles.tableCol}>{expense.notes || "-"}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ReportDocument;
