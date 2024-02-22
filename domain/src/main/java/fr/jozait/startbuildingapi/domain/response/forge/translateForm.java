package fr.jozait.startbuildingapi.domain.response.forge;

public class translateForm {
    private URNInfo input;
    private OutputInfo output;

    public translateForm(URNInfo input, OutputInfo output) {
        this.input = input;
        this.output = output;
    }

    public URNInfo getInput() {
        return input;
    }

    public void setInput(URNInfo input) {
        this.input = input;
    }

    public OutputInfo getOutput() {
        return output;
    }

    public void setOutput(OutputInfo output) {
        this.output = output;
    }
}

