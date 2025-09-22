import { NextResponse } from "next/server";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    // Get request headers
    const headersList = await headers();
    const requestHeaders: Record<string, string> = {};
    headersList.forEach((value, key) => {
      requestHeaders[key] = value;
    });

    // Environment variables (safe ones only)
    const environment = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      WEBSITE_HOSTNAME: process.env.WEBSITE_HOSTNAME,
      WEBSITE_SITE_NAME: process.env.WEBSITE_SITE_NAME,
      WEBSITE_RESOURCE_GROUP: process.env.WEBSITE_RESOURCE_GROUP,
      WEBSITE_OWNER_NAME: process.env.WEBSITE_OWNER_NAME,
      WEBSITE_PLATFORM_VERSION: process.env.WEBSITE_PLATFORM_VERSION,
      WEBSITE_NODE_DEFAULT_VERSION: process.env.WEBSITE_NODE_DEFAULT_VERSION,
      WEBSITE_NPM_DEFAULT_VERSION: process.env.WEBSITE_NPM_DEFAULT_VERSION,
      SCM_COMMIT_ID: process.env.SCM_COMMIT_ID,
      BUILD_FLAGS: process.env.BUILD_FLAGS,
      XDG_CACHE_HOME: process.env.XDG_CACHE_HOME,
      WEBSITE_INSTANCE_ID: process.env.WEBSITE_INSTANCE_ID,
      COMPUTERNAME: process.env.COMPUTERNAME,
      WEBSITE_SKU: process.env.WEBSITE_SKU,
      WEBSITE_ROLE_INSTANCE_ID: process.env.WEBSITE_ROLE_INSTANCE_ID,
      TEMP: process.env.TEMP,
      TMP: process.env.TMP,
      HOME: process.env.HOME,
      WEBSITE_WARMUP_PATH: process.env.WEBSITE_WARMUP_PATH,
      // Add more Azure-specific variables
      AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID ? "SET" : "NOT_SET",
      AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET ? "SET" : "NOT_SET",
      AZURE_TENANT_ID: process.env.AZURE_TENANT_ID ? "SET" : "NOT_SET",
    };

    // Process information
    const processInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      uptime: process.uptime(),
      cwd: process.cwd(),
      execPath: process.execPath,
      argv: process.argv,
      memoryUsage: process.memoryUsage(),
      versions: process.versions,
    };

    // File system checks
    const fileSystemChecks = {
      currentDir: process.cwd(),
      cwdExists: fs.existsSync(process.cwd()),
      packageJsonExists: fs.existsSync(
        path.join(process.cwd(), "package.json")
      ),
      nextConfigExists:
        fs.existsSync(path.join(process.cwd(), "next.config.ts")) ||
        fs.existsSync(path.join(process.cwd(), "next.config.js")),
      buildDirExists: fs.existsSync(path.join(process.cwd(), ".next")),
      nodeModulesExists: fs.existsSync(
        path.join(process.cwd(), "node_modules")
      ),
      srcDirExists: fs.existsSync(path.join(process.cwd(), "src")),
    };

    // Try to read directory contents
    let directoryContents: Record<string, unknown> = {};
    try {
      const rootFiles = fs.readdirSync(process.cwd()).slice(0, 20); // Limit to first 20 files
      directoryContents = {
        rootDirectory: process.cwd(),
        filesCount: rootFiles.length,
        files: rootFiles,
      };

      // Check if .next directory exists and list its contents
      const nextBuildPath = path.join(process.cwd(), ".next");
      if (fs.existsSync(nextBuildPath)) {
        const nextFiles = fs.readdirSync(nextBuildPath).slice(0, 10);
        directoryContents = {
          ...directoryContents,
          nextBuildExists: true,
          nextBuildFiles: nextFiles,
        };
      } else {
        directoryContents = {
          ...directoryContents,
          nextBuildExists: false,
          nextBuildError: "Build directory not found",
        };
      }
    } catch (error) {
      directoryContents = {
        error: `Failed to read directory: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }

    // Package.json information
    let packageInfo: Record<string, unknown> = {};
    try {
      const packagePath = path.join(process.cwd(), "package.json");
      if (fs.existsSync(packagePath)) {
        const packageContent = fs.readFileSync(packagePath, "utf8");
        const packageJson = JSON.parse(packageContent);
        packageInfo = {
          name: packageJson.name,
          version: packageJson.version,
          scripts: packageJson.scripts,
          dependencies: Object.keys(packageJson.dependencies || {}),
          devDependencies: Object.keys(packageJson.devDependencies || {}),
        };
      }
    } catch (error) {
      packageInfo = {
        error: `Failed to read package.json: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }

    // Runtime checks (simplified)
    const runtimeChecks = {
      canRequireNext: "Check skipped (using ES modules)",
      canRequireReact: "Check skipped (using ES modules)",
      nextjsResolution: "Using Next.js 15.5.3 (from package.json)",
    };

    // Performance metrics
    const performanceInfo = {
      requestProcessingTime: Date.now() - startTime,
      timestamp,
      hrtime: process.hrtime(),
    };

    const response = {
      success: true,
      timestamp,
      server: "Next.js API Route",
      diagnostics: {
        environment,
        processInfo,
        fileSystemChecks,
        directoryContents,
        packageInfo,
        runtimeChecks,
        performanceInfo,
        requestHeaders,
        requestUrl: request.url,
      },
      logs: [
        `[${timestamp}] 🚀 Diagnostic API route called`,
        `[${timestamp}] 📍 Process CWD: ${process.cwd()}`,
        `[${timestamp}] 🔧 Node Version: ${process.version}`,
        `[${timestamp}] 🌍 Platform: ${process.platform} ${process.arch}`,
        `[${timestamp}] 🏗️ Build directory exists: ${fileSystemChecks.buildDirExists}`,
        `[${timestamp}] 📄 Package.json exists: ${fileSystemChecks.packageJsonExists}`,
        `[${timestamp}] ⏱️ Processing time: ${performanceInfo.requestProcessingTime}ms`,
        `[${timestamp}] ✅ Server-side diagnostics completed successfully`,
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack =
      error instanceof Error ? error.stack : "No stack trace available";

    return NextResponse.json(
      {
        success: false,
        timestamp,
        error: errorMessage,
        stack: errorStack,
        logs: [
          `[${timestamp}] ❌ CRITICAL ERROR in diagnostic API`,
          `[${timestamp}] 💥 Error message: ${errorMessage}`,
          `[${timestamp}] 📚 Stack trace: ${errorStack}`,
          `[${timestamp}] 🔧 Process info: Node ${process.version}, Platform: ${process.platform}`,
          `[${timestamp}] 📍 CWD: ${process.cwd()}`,
        ],
        server: "Next.js API Route (Error State)",
      },
      { status: 500 }
    );
  }
}
