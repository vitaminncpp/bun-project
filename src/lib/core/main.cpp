#include <windows.h>
#include <iostream>
#include <thread>

// Define callback signature
typedef void(__stdcall *LogCallback)(const char *msg);

extern "C" __declspec(dllexport) int addNumbersWithLogs(int a, int b, LogCallback cb)
{
    std::thread t([]
                  {
                      while (true)
                      {
                          std::cout<<"this is DLL============================>\n";
                      } });

    t.detach();

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
