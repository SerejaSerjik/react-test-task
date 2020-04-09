import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const currencies = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "RUB",
    label: "₽",
  },
  {
    value: "PLN",
    label: "zł",
  },
];

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 100,
  },
  gridItem: {},
  paper: {
    padding: "25px 50px",
    minHeight: 75,
    display: "flex",
    alignItems: "center"
  },
}));

function App() {
  const classes = useStyles();
  const [amount, setAmount] = React.useState(0);
  const [currency, setCurrency] = React.useState("USD");
  const [convertedValue, setConvertedValue] = React.useState(0);
  const [rates, setRates] = React.useState({});

  const getCurrencyRate = () => {
    fetch("https://api.exchangeratesapi.io/latest")
    .then(res => res.json())
    .then(
      (result) => {
        const {rates} = result
        const neededRates = (({USD, RUB, PLN}) => ({USD, RUB, PLN}))(rates)
        setRates(neededRates)
      }
    )
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setCurrency(value);
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setAmount(value);
  };

  React.useEffect(() => {
    setConvertedValue(amount * rates[currency])
  }, [amount, currency, rates]);

  React.useEffect(() => {
    getCurrencyRate();
    setConvertedValue(0);
  }, []);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item md={4} xs={12} className={classes.gridItem}>
          <Paper className={classes.paper}>
            <TextField
              id="standard-basic"
              label="Amount in EUR"
              onChange={handleInputChange}
            />
          </Paper>
        </Grid>
        <Grid item md={4} xs={12} className={classes.gridItem}>
          <Paper className={classes.paper}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currency}
              onChange={handleSelectChange}
            >
              {currencies.map((option) => (
                <MenuItem value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </Paper>
        </Grid>
        <Grid item md={4} xs={12} className={classes.gridItem}>
          <Paper className={classes.paper}>
            <TextField
              disabled
              id="filled-disabled"
              label={`Total in ${currency} currency`}
              value={convertedValue}
              variant="filled"
              InputProps={{
                readOnly: true,
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
