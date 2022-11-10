const cleanExcelPadron = (data, dni) => {
  const cleanJson = data.map((element) => {
    delete element.MATRI_FEC
    delete element.RAZ_SOC
    delete element.CARR_PROG
    delete element.ESC_POS
    delete element.EGRES_FEC
    delete element.SEXO
    delete element.PROC_BACH
    delete element.GRAD_TITU
    delete element.TRAB_INV
    delete element.NUM_CRED
    delete element.REG_METADATO
    delete element.PROG_ESTU
    delete element.PROC_TITULO_PED
    delete element.PROG_ACREDIT
    delete element.FEC_INICIO_ACREDIT
    delete element.FEC_FIN_ACREDIT
    delete element.FEC_INICIO_MOD_TIT_ACREDIT
    delete element.FEC_FIN_MOD_TIT_ACREDIT
    delete element.FEC_SOLICIT_GRAD_TIT
    delete element.TRAB_INVEST_ORIGINAL
    delete element.PROC_REV_PAIS
    delete element.PROC_REV_UNIV
    delete element.PROC_REV_GRADO_EXT
    delete element.CRIT_REV
    //  Para no duplicados
    delete element.DIPL_FEC_DUP
    //  Para los n° de diplomas
    delete element.DIPL_NUM
    delete element.CARGO1
    delete element.AUTORIDAD1
    delete element.CARGO2
    delete element.AUTORIDAD2
    delete element.CARGO3
    delete element.AUTORIDAD3
    delete element.PROC_PAIS_EXT
    delete element.PROC_UNIV_EXT
    delete element.PROC_GRADO_EXT
    delete element.REG_OFICIO
    delete element.FEC_MAT_PROG
    delete element.FEC_INICIO_PROG
    delete element.FEC_FIN_PROG
    delete element.MOD_SUSTENTACION
    delete element.ACTO_FEC
    delete element["FECHA ESTADO"]
    delete element.ESTADO
    delete element.F_FEC_OFI
    delete element.C_RTD_SUNEDU
    delete element.F_FEC_RTD
    delete element.FEC_RESO_FAC_ESC
    delete element.F_FEC_RES_FAC

    return {...element, dniAct: Number(dni)}
  })
  return cleanJson
}

export { cleanExcelPadron }