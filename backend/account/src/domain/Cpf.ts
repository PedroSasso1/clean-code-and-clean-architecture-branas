export default class Cpf {
  private value: string;

  constructor(cpf: string) {
    if (!this.validate(cpf)) throw new Error('Invalid cpf');
    this.value = cpf;
  }

  private validate(cpf: string) {
    if (!cpf) return false;
    cpf = this.clean(cpf);
    if (this.isInvalidLength(cpf)) return false;
    if (this.allDigitsTheSame(cpf)) {
      const dg1 = this.calculateDigit(cpf, 10);
      const dg2 = this.calculateDigit(cpf, 11);
      let checkDigit = this.extractDigit(cpf);
      const calculatedDigit = `${dg1}${dg2}`;
      return checkDigit === calculatedDigit;
    } else return false;
  }

  private clean(cpf: string) {
    return cpf.replace(/\D/g, '');
  }

  private isInvalidLength(cpf: string) {
    return cpf.length !== 11;
  }

  private allDigitsTheSame(cpf: string) {
    return !cpf.split('').every((c) => c === cpf[0]);
  }

  private calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  private extractDigit(cpf: string) {
    return cpf.substring(cpf.length - 2, cpf.length);
  }

  public getValue() {
    return this.value;
  }
}
