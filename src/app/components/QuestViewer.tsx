import React, { FC } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'

type Props = {
  questId: number
  questData(id: number): {
    chapterId: number
    name: string
    lv: number
    ap: number
    bond: number
    exp: number
    qp: number
    drop: string
    attributes: string
    enemies: [
      [
        {
          enemyId: number
          name: string
          class: string
          lv: number
          hp: number
          buff: string
          dr: string
          attributes: string
          characteristics: string
        }
      ]
    ]
  }
}

const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 14,
      padding: 4,
      paddingRight: 10,
      paddingLeft: 10
    },
    body: {
      fontSize: 14,
      padding: 4,
      paddingRight: 10,
      paddingLeft: 10,
      border: 0
    },
    body2nd: {
      fontSize: 11,
      padding: 4,
      paddingRight: 10,
      paddingLeft: 10,
      border: 0
    },
    bodyOdd: {
      backgroundColor: theme.palette.action.hover,
      fontSize: 14,
      padding: 4,
      paddingRight: 10,
      paddingLeft: 10,
      border: 0
    },
    body2ndOdd: {
      backgroundColor: theme.palette.action.hover,
      fontSize: 11,
      padding: 4,
      paddingRight: 10,
      paddingLeft: 10,
      border: 0
    },
    container: {
      maxWidth: 1024,
      padding: 6
    },
    waveTitle: {
      backgroundColor: theme.palette.common.black,
      marginBottom: 0
    }
  }))
)

const formatNumber = (value: number) => Number(value).toLocaleString().padStart(6 + 1, String.fromCharCode(0xa0))
const formatDR = (value: number) => `${value}%`

type TableColumnInfo = {
  label: string
  key: string
  align: "left" | "right" | "center"
  width: string
  formatter?: (value: number) => string
  span?: number
}
const questInfoTableColumns : TableColumnInfo[] = [
  { label: 'Lv', key: 'lv', align: "left", width: "10%" },
  { label: 'AP', key: 'ap', align: "left", width: "10%" },
  { label: '絆', key: 'bond', align: "left", width: "10%" },
  { label: 'Exp', key: 'exp', align: "left", width: "10%" },
  { label: 'QP', key: 'qp', align: "left", width: "10%" },
  { label: '', key: 'notdef', align: "left", width: "5%" },
  { label: '地形', key: 'attributes', align: "left", width: "40%" },
]

const enemyInfoTableColumnsPC : TableColumnInfo[][] = [[
  { label: 'Name', key: 'name', align: "left", width: "20%" },
  { label: '', key: 'class', align: "left", width: "5%" },
  { label: 'DR', key: 'dr', align: "center", width: "5%", formatter: formatDR},
  { label: 'HP', key: 'hp', align: "left", width: "10%", formatter: formatNumber },
  { label: '属性', key: 'attributes', align: "left", width: "10%" },
  { label: '特性', key: 'characteristics', align: "left", width: "20%" },
  { label: 'Buff', key: 'buff', align: "left", width: "15%" },
]]

const enemyInfoTableColumnsSP : TableColumnInfo[][] = [
  [
    { label: 'Name', key: 'name', align: "left", width: "50%", span: 3},
    { label: 'Buff', key: 'buff', align: "left", width: "20%" },
    { label: 'HP', key: 'hp', align: "right", width: "20%", formatter: formatNumber },
  ],
  [
    { label: 'Class', key: 'class', align: "left", width: "10%" },
    { label: 'DR', key: 'dr', align: "left", width: "10%", formatter: formatDR },
    { label: '属性', key: 'attributes', align: "left", width: "10%" },
    { label: '特性', key: 'characteristics', align: "left", width: "40%", span: 2 },
  ]
]

export const QuestViewer: FC<Props> = (props) => {
  const classes = useStyles();
  const questData = props.questData(props.questId)

  if (!questData) {
    return (
      <></>
    )
  }
  const theme = useTheme();
  const isSP = useMediaQuery(theme.breakpoints.down('xs'));
  const enemyInfoTableColumns = isSP ? enemyInfoTableColumnsSP : enemyInfoTableColumnsPC
  const cellClassNames = [[ classes.body, classes.body2nd ], [classes.bodyOdd, classes.body2ndOdd ]]

  return (
    <>
      <TableContainer className={classes.container}>
        <Table>
          <TableHead>
            <TableRow key="label">
              {questInfoTableColumns.map((column, idx) =>
                <TableCell className={classes.head} key={idx} width={column.width}>{column.label}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={props.questId}>
              {questInfoTableColumns.map((column) =>
                <TableCell className={classes.body} key={column.key} align={column.align} width={column.width}>
                  {column.formatter ? column.formatter(questData[column.key]) : questData[column.key]}
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <p></p>
      <TableContainer className={classes.container}>
        {!isSP &&
          <Table>
            <TableHead>
              {enemyInfoTableColumns.map((row, rowIdx) =>
                <TableRow key={`label-${rowIdx}`}>
                  {row.map((column) =>
                    <TableCell className={classes.head} key={column.label} width={column.width} colSpan={column.span ? column.span : 1}>{column.label}</TableCell>
                  )}
                </TableRow>
              )}
            </TableHead>
          </Table>
        }
        {questData.enemies.map( (wave, waveNo) => (
          <div key={`div-${waveNo}`}>
          <p className={classes.waveTitle}>w{waveNo + 1}</p>
          <Table>
            <TableBody>
              {wave.map( (enemy, enemyNo) => (
                enemyInfoTableColumns.map((row, rowNo) =>
                  <TableRow key={`${waveNo}-${enemyNo}-${rowNo}`}>
                    {row.map((column, columnNo) =>
                      <TableCell className={cellClassNames[enemyNo % 2][rowNo == 0 ? 0 : 1]} key={`${waveNo}-${enemyNo}-${columnNo}`} align={column.align} width={column.width} colSpan={column.span ? column.span : 1}>
                        {column.formatter ? column.formatter(enemy[column.key]) : enemy[column.key]}
                      </TableCell>
                    )}
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
          </div>
        ))}
      </TableContainer>
    </>
  )
}
