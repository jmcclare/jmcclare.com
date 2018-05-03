import React from 'react'
import ReactDOM from 'react-dom'


// Set this to true to enable debugging output.
const enableDebug = false

const debug = function(msg)
{
  if ( enableDebug === true )
  {
    console.log(msg)
  }
}


var Row = function(props)
{
  return (
    <tr>
      <td className="year">{props.item.year}</td>
      <td className="passiveGrowth">$ {commaFmt(props.item.passiveGrowth)}</td>
      <td className="spent">$ {commaFmt(props.item.spent)}</td>
      <td className="total">$ {commaFmt(props.item.total)}</td>
      <td className="iPassiveGrowth">$ {commaFmt(props.item.iPassiveGrowth)}</td>
      <td className="iTotal">$ {commaFmt(props.item.iTotal)}</td>
    </tr>
  )
}


/*
 * Formats a number string with commas.
 */
const commaFmt = function(s)
{
  // The Complicated, manual way to do it.
  //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // The easier, built‐in way.
  //
  // toLocaleString is a method of the Number class. Make sure we have a Number.
  return Number(s).toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2})
}


class Table extends React.Component
{
  render()
  {

    const rows = this.props.data.map(item => {
      return (
        <Row key={item.year} item={item} />
      )
    })

    return (
      <div className="financial-results">
        <table>
          <thead>
            <tr>
              <th colSpan="4">Absolute</th>
              <th colSpan="2">Inflation Adjusted</th>
            </tr>
            <tr>
              <th>Year</th>
              <th>Passive Growth</th>
              <th>Spent</th>
              <th>Total</th>
              <th>Passive Growth</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}


class NumField extends React.Component
{
  constructor(props)
  {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e)
  {
    this.props.onChange(e.target.value);
  }

  render()
  {
    var err = ''
    if ( this.props.err )
    {
      err = (
        <p className="error">{' ' + this.props.err}</p>
      )
    }
    return (
      <p>
        <div className="input-line">
          <label htmlFor={this.props.varName}>{this.props.label}:</label>
          <span> </span>
          <input
            name={this.props.name}
            value={this.props.value}
            onChange={this.handleChange}
          />
        </div>
        {err}
      </p>
    )
  }
}


class VarsForm extends React.Component
{
  constructor(props)
  {
    super(props)
  }

  render() {
    return (
      <form className="vars-form">
        <NumField
          name="startingTotal"
          label="Starting Total"
          value={this.props.startingTotal}
          onChange={this.props.onStartingTotalChange}
          err={this.props.stErr}
        />
        <NumField
          name="yearlyContrib"
          label="Yearly Contribution"
          value={this.props.yearlyContrib}
          onChange={this.props.onYearlyContribChange}
          err={this.props.ycErr}
        />
        <NumField
          name="growthRate"
          label="Growth Rate"
          value={this.props.growthRate}
          onChange={this.props.onGrowthRateChange}
          err={this.props.growthRateErr}
        />
        <NumField
          name="inflationRate"
          label="Inflation Rate"
          value={this.props.inflationRate}
          onChange={this.props.onInflationRateChange}
          err={this.props.inflationRateErr}
        />
        <NumField
          name="spendingRate"
          label="Spending Rate"
          value={this.props.spendingRate}
          onChange={this.props.onSpendingRateChange}
          err={this.props.spendingRateErr}
        />
        <NumField
          name="years"
          label="Years"
          value={this.props.years}
          onChange={this.props.onYearsChange}
          err={this.props.yearsErr}
        />
      </form>
    )
  }
}

          //inflationRate={this.state.inflationRate}
          //onInflationRateChange={this.handleInflationRateChange}
          //inflationRateErr={this.state.irErr}

class ICalc extends React.Component
{
  constructor(props)
  {
    super(props)

    this.handleNumberChange = this.handleNumberChange.bind(this)
    this.handleStartingTotalChange = this.handleStartingTotalChange.bind(this)
    this.handleYearlyContribChange = this.handleYearlyContribChange.bind(this)
    this.handleYearsChange = this.handleYearsChange.bind(this)
    this.handleGrowthRateChange = this.handleGrowthRateChange.bind(this)
    this.handleSpendingRateChange = this.handleSpendingRateChange.bind(this)
    this.handleInflationRateChange = this.handleInflationRateChange.bind(this)

    this.state =
    {
      startingTotal: 0.00,
      stErr: '',
      growthRate: 0.07,
      grErr: '',
      spendingRate: 0.0,
      srErr: '',
      inflationRate: 0.03,
      irErr: '',
      yearlyContrib: 30000.00,
      ycErr: '',
      years: 20,
      yearsErr: ''
    }
  }

  handleNumberChange(input, numField, errField)
  {
    this.setState((prevState, props) =>
    {
      // Check the input
      var err = ''
      if ( ! input ) { err = 'Please enter a number.' }
      if (Number.isNaN(Number(input))) { err = 'Please enter a number.' }

      //return { startingTotal: input, stErr: err }

      var update = {}
      update[numField] = input
      update[errField] = err
      return update
    })
  }

  handleStartingTotalChange(input)
  {
    return this.handleNumberChange(input, 'startingTotal', 'stErr')
  }

  handleYearlyContribChange(input)
  {
    return this.handleNumberChange(input, 'yearlyContrib', 'ycErr')
  }

  handleYearsChange(input)
  {
    return this.handleNumberChange(input, 'years', 'yearsErr')
  }

  handleGrowthRateChange(input)
  {
    return this.handleNumberChange(input, 'growthRate', 'grErr')
  }

  handleSpendingRateChange(input)
  {
    return this.handleNumberChange(input, 'spendingRate', 'srErr')
  }

  handleInflationRateChange(input)
  {
    return this.handleNumberChange(input, 'inflationRate', 'irErr')
  }

  render()
  {
    var data = calcData(this.state)
    return (
      <div className="icalc">
        <VarsForm
          startingTotal={this.state.startingTotal}
          stErr={this.state.stErr}
          onStartingTotalChange={this.handleStartingTotalChange}
          yearlyContrib={this.state.yearlyContrib}
          ycErr={this.state.ycErr}
          onYearlyContribChange={this.handleYearlyContribChange}
          years={this.state.years}
          yearsErr={this.state.yearsErr}
          onYearsChange={this.handleYearsChange}
          growthRate={this.state.growthRate}
          onGrowthRateChange={this.handleGrowthRateChange}
          growthRateErr={this.state.grErr}
          inflationRate={this.state.inflationRate}
          onInflationRateChange={this.handleInflationRateChange}
          inflationRateErr={this.state.irErr}
          spendingRate={this.state.spendingRate}
          onSpendingRateChange={this.handleSpendingRateChange}
          spendingRateErr={this.state.srErr}
        />
        <Table
          data={data}
        />
      </div>
    )
  }
}


const calcData = function(params)
{
  var data = []
  var total = params.stErr ? 0 : Number(params.startingTotal)
  var iTotal = params.stErr ? 0 : Number(params.startingTotal)
  var spent, passiveGrowth, iPassiveGrowth
  const yearlyContrib = params.ycErr ? 0 : Number(params.yearlyContrib)
  const years = params.yearsErr ? 0 : Number(params.years)
  const growthRate = params.grErr ? 0 : Number(params.growthRate)
  const spendingRate = params.srErr ? 0 : Number(params.spendingRate)
  const inflationRate = params.irErr ? 0 : Number(params.inflationRate)
  debug('in calcData, params.yearlyContrib: ' + params.yearlyContrib)
  debug('in calcData, yearlyContrib: ' + yearlyContrib)
  debug('in calcData, params.years: ' + params.years)

  data.push({year: 0, passiveGrowth: 0, spent: 0, total: total, iPassiveGrowth: 0, iTotal: iTotal})

  for (var i = 1; i <= years; i++)
  {
    passiveGrowth = total * growthRate
    spent = total * spendingRate
    total = (total * (1 + growthRate - spendingRate)) + yearlyContrib
    iPassiveGrowth = iTotal * (growthRate - inflationRate)
    iTotal = total * Math.pow((1 - inflationRate), i)

    data.push({year: i, passiveGrowth: passiveGrowth, spent: spent, total: total, iPassiveGrowth: iPassiveGrowth, iTotal: iTotal})

    //iTotal = iTotal * (1 + growthRate - inflationRate - spendingRate) + yearlyContrib
  }
  return data
}


export default ICalc
