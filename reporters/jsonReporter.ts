import fs from "fs";
import path from "path";
import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
  Suite,
} from "@playwright/test/reporter";

interface TestSummary {
  [suiteName: string]: {
    name: string;
    status: string;
  }[];
}

export default class JsonReporter implements Reporter {
  private results: TestSummary = {};
  private outputFile: string;

  constructor(options: { outputFile?: string } = {}) {
    this.outputFile =
      options.outputFile || path.join(process.cwd(), "test-summary.json");
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const suiteName = test.parent?.title || "Uncategorized";
    const testName = test.title;
    const status = result.status;

    if (!this.results[suiteName]) {
      this.results[suiteName] = [];
    }

    this.results[suiteName].push({ name: testName, status });
  }

  onEnd(result: FullResult): void {
    fs.writeFileSync(
      this.outputFile,
      JSON.stringify(this.results, null, 2),
      "utf-8"
    );
    console.log(`📝 Test summary saved to: ${this.outputFile}`);
  }
}
