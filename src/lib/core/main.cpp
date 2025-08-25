#include <windows.h>
#include <iostream>
#include <thread>

// Define callback signature
typedef void(__stdcall *LogCallback)(const char *msg);

extern "C" __declspec(dllexport) int addNumbersWithLogs(int a, int b, LogCallback cb)
{
    std::thread t([cb]
                  {
                      while (true)
                      {
                          Sleep(200);
                          cb("test");
                        //   std::cout << "test" << std::endl;
                      } });

    t.detach();
    for (int i = 0; i < 10; i++)
    {
        Sleep(500);

        // Build message
        std::string msg = "C++ loop: " + std::to_string(i) +
                          " | a=" + std::to_string(a) +
                          " b=" + std::to_string(b);

        // Send message to Node
        cb(msg.c_str());
    }

    return a + b;
}

BOOL APIENTRY DllMain(HMODULE hModule,
                      DWORD ul_reason_for_call,
                      LPVOID lpReserved)
{
    return TRUE;
}
