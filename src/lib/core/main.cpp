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
                      } });

    t.detach();
    for (int i = 0; i < 10; i++)
    {
        Sleep(500);

        std::string msg = "C++ loop: " + std::to_string(i) +
                          " | a=" + std::to_string(a) +
                          " b=" + std::to_string(b);

        cb(msg.c_str());
    }

    return a + b;
}

BOOL APIENTRY DllMain(HMODULE hModule,
                      DWORD ul_reason_for_call,
                      LPVOID lpReserved)
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
        std::cout << "DLL loaded into process\n";
        break;
    case DLL_THREAD_ATTACH:
        std::cout << "DLL thread attach\n";
        break;
    case DLL_THREAD_DETACH:
        std::cout << "DLL thread detattach\n";
        break;
    case DLL_PROCESS_DETACH:
        std::cout << "DLL unloaded from process\n";
        break;
    }
    return TRUE;
}
