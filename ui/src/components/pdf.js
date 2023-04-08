import { Page, Text, Document, StyleSheet } from '@react-pdf/renderer';


export const Pdf = ({ planText, vacationLocation }) => {
  const styles = StyleSheet.create({
    title: {
      textAlign: "center",
      fontFamily: "Helvetica",
      fontSize: 20
    },
    body: {
      fontSize: 14,
      fontFamily: "Helvetica"
    }
  })
  return (
    <Document>
      <Page>
        <Text style={styles.title}>Itinerary for Vacation to { vacationLocation }</Text>
        <Text style={styles.body}>{ planText }</Text>
      </Page>
    </Document>
  );
}