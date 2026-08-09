#!/usr/bin/env node
// @trace SREQ-023C @
import { saveConfigSettings } from "../core/utils/config-file-operations.util.js";
import { MASTER_CONFIG_NAME } from "../core/utils/system-config.default.util.js";

saveConfigSettings(MASTER_CONFIG_NAME);