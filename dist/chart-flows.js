let ChartFlows ={
    Blocks : {},
    Symbols : {},
    version :1.0
}

ChartFlows.init = function ChartFlows() {
    return {}
}
ChartFlows.Blocks.Base = class Base {
}
ChartFlows.Blocks.End = class End extends ChartFlows.Blocks.Base{
}
ChartFlows.Blocks.Process = class Process extends ChartFlows.Blocks.Base{
}
ChartFlows.Blocks.Start = class Start extends ChartFlows.Blocks.Base{
}
ChartFlows.Symbols.Arrow = class Arrow extends ChartFlows.Symbols.Symbol {
}
ChartFlows.Symbols.Symbol = class Symbol {
}