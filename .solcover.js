module.exports = {
    configureYulOptimizer: true,
    solcOptimizerDetails: {
        yul: true,
        yulDetails: {
            optimizerSteps:
                "dhfoDgvlfnTUtnIf" +               // None of these can make stack problems worse
                "[" +
                    "xa[r]EsLM" +                 // Turn into SSA and simplify
                    "CTUtTOntnfDIl" +             // Perform structural simplification
                    "Ll" +                        // Simplify again
                    "Vl [j]" +                    // Reverse SSA

                    // should have good "compilability" property here.

                    "Tpel" +                       // Run functional expression inliner
                    "xa[rl]" +                     // Prune a bit more in SSA
                    "xa[r]L" +                    // Turn into SSA again and simplify
                    "gvf" +                        // Run full inliner
                    "CTUa[r]LSsTFOtfDna[r]Il" + // SSA plus simplify
                "]" +
                "jml[jl] VTOl jml : fDnTO",
        },
    },
    skipFiles: ['mocks', 'interfaces'],
}
