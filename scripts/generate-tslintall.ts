// tslint:disable:no-implicit-dependencies
import * as fs from 'fs';
import * as json from 'json-stable-stringify';
import * as path from 'path';
import * as tmp from 'tmp';
import * as tslint from 'tslint';

const ruleToJsonObject = (rule: Partial<tslint.IOptions>) => {
  const args = rule.ruleArguments as any[];
  if (args.length === 0) {
    return true;
  }
  return [true, ...args];
};

tmp.setGracefulCleanup();
const tmpfile = path.join(tmp.dirSync().name, 'tslint.json');
fs.writeFileSync(tmpfile, '{"extends": "tslint:all"}');
const config = tslint.Configuration.loadConfigurationFromPath(tmpfile);
const rules: { [key: string]: true | any[] } = {};
const o = {
  $schema: 'http://json.schemastore.org/tslint',
  rules
};
config.rules.forEach((rule, name) => (rules[name] = ruleToJsonObject(rule)));
process.stdout.write(json(o, { space: 2 }));
