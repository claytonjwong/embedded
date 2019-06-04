# Introduction to Embedded Systems Software and Development Environments
![University of Colorado Boulder](docs/UCBoulder.png)

---
## Lectures
* [**Week 1: Embedded System Development Components**](1_week)
  * [Introduction to Embedded Systems](1_week#introduction-to-embedded-systems)
  * [Embedded Software Engineering](1_week#embedded-software-engineering)
  * [C-Programming Review](1_week#c-programming-review)
* [**Week 2: Compilation with GCC and GNU Make**](2_week)
  * [Introduction to Build Systems using GNU Toolsets](2_week#introduction-to-build-systems-using-gnu-toolsets)
  * [Compiling and Invoking GCC](2_week#compiling-and-invoking-gcc)
  * [Preprocessor Directives](2_week#preprocessor-directives)
  * [Creating Header and Implementation Files](2_week#creating-header-and-implementation-files)
  * [Linkers](2_week#linkers)
  * [Make](2_week#make)
  * [Makefiles](2_week#makefiles)
  * [Other Useful GNU Bin Tools](2_week#other-useful-gnu-bin-tools)
* [**Week 3: Memory Types, Segments and Management**](3_week)
	* [Introduction to Memory Organization](3_week#introduction-to-memory-organization)
	* [Memory Architectures](3_week#memory-architectures)
	* [Memory Segments](3_week#memory-segments)
	* [Data Memory](3_week#data-memory)
	* [Special Keywords](3_week#special-keywords)
	* [The Stack](3_week#the-stack)
	* [The Heap](3_week#the-heap)
	* [Code Memory](3_week#code-memory)

---
## Resources
* [Makefile Tutorial](https://gist.github.com/isaacs/62a2d1825d04437c6f08)
* [Friendly ARM](https://www.friendlyarm.com/)
  * [NanoPi NEO2](http://www.nanopi.org/NanoPi-NEO2_Feature.html)

---
## Assignments
* [**Week 1: Statistical Analytics**](#week-1-statistical-analytics)
    * [stats.h](#stats-h)
    * [stats.c](#stats-c)
    * [main.c [1]](#main-c-1-)
    * [output [1]](#output-1-)
* [**Week 2: Cross-Compilation with GCC and GNU Make**](#week-2-cross-compilation-with-gcc-and-gnu-make)
    * [sources.mk [2]](#sources-mk-2-)
    * [Makefile [2]](#makefile-2-)
    * [Cross-Compilation](#cross-compilation)
* [**Week 3: Memory Analysis**](#week-3-memory-analysis)
    * [misc.h](#misc-h)
    * [misc.c](#misc-c)
    * [main.c](#main-c)
    * [sources.mk [3]](#sources-mk-3-)
    * [Makefile [3]](#makefile-3-)
    * [Commands and Output](#commands-and-output)
    * [Symbol Information](#symbol-information)
    * [FIXME: CMakeLists.txt](#fixme-cmakelists-txt)
    
### Week 1: Statistical Analytics
* [stats.h](#stats-h)
* [stats.c](#stats-c)
* [main.c [1]](#main-c-1-)
* [output [1]](#output-1-)

#### stats.h
```c
typedef unsigned char Type;
typedef Type* HType;
```

#### stats.c
```c
  #include <limits.h>
  #include <stdlib.h>
  #include <stdio.h>
  #include "stats.h"

  const int INF = INT_MAX;

  void print_statistics( HType A, size_t N ){
      printf( "sorted: " );
      sort_array( A, N, compare );
      print_array( A, N );
      Type min = find_minimum( A, N ),
           max = find_maximum( A, N );
      double median = find_median( A, N ),
             mean   = find_mean( A, N );
      printf( "min:    %d\n", min );
      printf( "max:    %d\n", max );
      printf( "median: %.1lf\n", median );
      printf( "mean:   %.1lf\n", mean );
  }

  void print_array( HType A, size_t N ){
      if( ! A )
          return;
      for( int i=0; i < N; printf( "%d ", A[ i++ ] ) );
      printf( "\n" );
  }

  double find_median( HType A, size_t N ){
      if( ! A )
          return 0;
      sort_array( A, N, compare );
      return( N%2 )? A[ N/2 ] : ( A[ (N-1)/2 ] + A[ N/2 ] ) / 2;
  }

  double find_mean( HType A, size_t N ){
      if( ! A )
          return 0;
      int sum = 0;
      for( int i=0; i < N; sum += A[ i++ ] );
      return sum / N;
  }

  Type find_maximum( HType A, size_t N ){
      if( ! A )
          return 0;
      int max = -INF;
      for( int i=0; i < N; ++i )
          if( max < A[ i ] )
              max = A[ i ];
      return max;
  }

  Type find_minimum( HType A, size_t N ){
      if( ! A )
          return 0;
      int min = INF;
      for( int i=0; i < N; ++i )
          if( min > A[ i ] )
              min = A[ i ];
      return min;
  }

  int compare( const void* lhs, const void* rhs ){
      if( ! lhs || ! rhs )
          return 0;
      HType first  = ( HType ) lhs,
            second = ( HType ) rhs;
      Type a = *first,
           b = *second;
      return( a < b )? -1
          : ( a > b )?  1
          :             0;
  }

  void sort_array( HType A, size_t N, int ( * cmp )( const void*, const void* ) ){
      if( ! A )
          return;
      qsort( A, N, sizeof( Type ), cmp );
  }
```

#### main.c [1]
```c
#include <stdio.h>
#include "stats.h"

/* Size of the Data Set */
#define SIZE ( 40 )

int main(){
    Type test[ SIZE ] = {  34, 201, 190, 154,   8, 194,   2,   6,
                          114,  88,  45,  76, 123,  87,  25,  23,
                          200, 122, 150,  90,  92,  87, 177, 244,
                          201,   6,  12,  60,   8,   2,   5,  67,
                            7,  87, 250, 230,  99,   3, 100,  90, };
    printf( "raw:    " );
    print_array( test, SIZE );
    print_statistics( test, SIZE );
    return 0;
}
```

#### Output [1]
```
    raw:    34 201 190 154 8 194 2 6 114 88 45 76 123 87 25 23 200 122 150 90 92 87 177 244 201 6 12 60 8 2 5 67 7 87 250 230 99 3 100 90
    sorted: 2 2 3 5 6 6 7 8 8 12 23 25 34 45 60 67 76 87 87 87 88 90 90 92 99 100 114 122 123 150 154 177 190 194 200 201 201 230 244 250
    min:    2
    max:    250
    median: 87.0
    mean:   93.0
```

---
### Week 2: Cross-Compilation with GCC and GNU Make
* [sources.mk [2]](#sources-mk-2-)
* [Makefile [2]](#makefile-2-)
* [Cross-Compilation](#cross-compilation)

#### sources.mk [2]

```makefile
  SOURCES =  \
    main.c   \
    memory.c

  SOURCES_MSP432 =               \
    interrupts_msp432p401r_gcc.c \
    startup_msp432p401r_gcc.c    \
    system_msp432p401r.c

  INCLUDE_DIRS =        \
    -I../include/common \
    -I../include/msp432 \
    -I../include/CMSIS
```

#### Makefile [2]

```makefile
  #------------------------------------------------------------------------------
  # Makefile for HOST and MSP432 platforms
  #
  # Use: make [TARGET] [PLATFORM-OVERRIDES]
  #
  # Build Targets:
  #      %.i
  #      %.asm
  #      %.o
  #      compile-all
  #      build
  #      clean
  #      print-VARIABLE
  #
  # Platform Overrides:
  #      HOST
  #      MSP432
  #
  #------------------------------------------------------------------------------

  include sources.mk

  PLATFORM = HOST
  OBJECTS = $(SOURCES:.c=.o)
  TARGET = c1m2.out
  CFLAGS = -Wall -Werror -O0 -std=c99 $(FLAGS)
  DEPFLAGS = -MT $@ -MMD -MP -MF $*.dep

  ifeq ($(PLATFORM), HOST)
    CC = gcc
    SIZE = size
    SIZE_FLAGS = -l -m -x
  endif
  ifeq ($(PLATFORM), MSP432)
    TOOLCHAIN_DIR = /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin
    CC = $(TOOLCHAIN_DIR)/arm-none-eabi-gcc
    SIZE = $(TOOLCHAIN_DIR)/arm-none-eabi-size
    SIZE_FLAGS = -A -x
    ARCH = armv7e-m
    CPU = cortex-m4
    SPECS = nosys.specs
    LINKER_FILE = msp432p401r.lds
    LDFLAGS = -Wl,-Map=c1m2.map
    PLATFORM_FLAGS = -march=$(ARCH) -mcpu=$(CPU) --specs=$(SPECS) -T $(LINKER_FILE)
    OBJECTS := $(OBJECTS) $(SOURCES_MSP432:.c=.o)
  endif

  $(TARGET): $(OBJECTS)
    $(CC) -o $@ $^ -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(LDFLAGS) $(PLATFORM_FLAGS)
    $(SIZE) $(SIZE_FLAGS) $@

  %.o: %.c
    $(CC) -o $@ -c $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)

  %.asm: %.c
    $(CC) -o $@ -S $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)

  %.i: %.c
    $(CC) -o $@ -E $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)

  .PHONY: clean
  clean:
    -@rm *.asm *.dep *.i *.map *.o *.out 2> /dev/null || true

  .PHONY: build
  build: $(TARGET)

  .PHONY: compile-all
  compile-all: $(OBJECTS)

  print-% :
    @echo $* = $($*)

```

#### Cross-Compilation
```shell
   $ make clean
   $ make TARGET=c1m2.out PLATFORM=HOST
   gcc -o main.o -c main.c -DHOST -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS
   gcc -o memory.o -c memory.c -DHOST -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS
   gcc -o c1m2.out main.o memory.o -DHOST -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS
   size -l -m -x c1m2.out
   Segment __PAGEZERO: 0x100000000 (vmaddr 0x0 fileoff 0)
   Segment __TEXT: 0x1000 (vmaddr 0x100000000 fileoff 0)
     Section __text: 0x275 (addr 0x100000d10 offset 3344)
     Section __stubs: 0x6 (addr 0x100000f86 offset 3974)
     Section __stub_helper: 0x1a (addr 0x100000f8c offset 3980)
     Section __cstring: 0x5 (addr 0x100000fa6 offset 4006)
     Section __unwind_info: 0x48 (addr 0x100000fac offset 4012)
     total 0x2e2
   Segment __DATA: 0x1000 (vmaddr 0x100001000 fileoff 4096)
     Section __nl_symbol_ptr: 0x10 (addr 0x100001000 offset 4096)
     Section __la_symbol_ptr: 0x8 (addr 0x100001010 offset 4112)
     Section __common: 0xa (addr 0x100001020 offset 0)
     total 0x22
   Segment __LINKEDIT: 0x1000 (vmaddr 0x100002000 fileoff 8192)
   total 0x100003000
  
   $ ./c1m2.out
   aXy72_L+R
  
   $ make clean
   $ make TARGET=c1m2.out PLATFORM=MSP432
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o main.o -c main.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT main.o -MMD -MP -MF main.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o memory.o -c memory.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT memory.o -MMD -MP -MF memory.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o interrupts_msp432p401r_gcc.o -c interrupts_msp432p401r_gcc.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT interrupts_msp432p401r_gcc.o -MMD -MP -MF interrupts_msp432p401r_gcc.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o startup_msp432p401r_gcc.o -c startup_msp432p401r_gcc.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT startup_msp432p401r_gcc.o -MMD -MP -MF startup_msp432p401r_gcc.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o system_msp432p401r.o -c system_msp432p401r.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT system_msp432p401r.o -MMD -MP -MF system_msp432p401r.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o c1m2.out main.o memory.o interrupts_msp432p401r_gcc.o startup_msp432p401r_gcc.o system_msp432p401r.o -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT c1m2.out -MMD -MP -MF c1m2.dep -Wl,-Map=c1m2.map -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-size -A -x c1m2.out
   c1m2.out  :
   section                     size         addr
   .intvecs                   0x140          0x0
   .text                      0xd70        0x140
   .text:Reset_Handler         0x6c        0xeb0
   .text:NMI_Handler            0xe        0xf1c
   .text:HardFault_Handler      0xe        0xf2a
   .text:Default_Handler        0xe        0xf38
   .rodata                      0x4        0xf48
   .eh_frame                    0x4        0xf4c
   .ARM.exidx                   0x8        0xf50
   .data                      0x43c   0x20000000
   .bss                        0x4c   0x2000043c
   .ARM.attributes             0x2a          0x0
   .comment                    0x75          0x0
   .debug_frame               0x2e4          0x0
   Total                     0x1761
```

---
### Week 3: Memory Analysis
* [misc.h](#misc-h)
* [misc.c](#misc-c)
* [main.c](#main-c)
* [sources.mk [3]](#sources-mk-3-)
* [Makefile [3]](#makefile-3-)
* [Commands and Output](#commands-and-output)
* [Symbol Information](#symbol-information)
* [FIXME: CMakeLists.txt](#fixme-cmakelists-txt)

Based on the code and the linker file, specify the following details for the segment,
sub-segment, permissions, and lifetime for each of the following symbols:

#### misc.h
```c
    #define N (10U)
    
    int func(int * f1);
```

#### misc.c
```c
    #include "misc.h"
    
    #define SOME_VALUE (6)
    
    int g5[10] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
    
    int func(int * f1)
    {
      static int f2;
      unsigned int f3 = 0;
      volatile char * f4 = "Hello World!\n";
    
      f2++;
      *(&g5[0] + f2) = f3;
    
      for (f3 = 0; f3 < SOME_VALUE; f3++)
      {
        g5[f3] = f4[f3];
        f2++;
      }
    
      return f2;
    }
```

#### main.c
```c
    #include <stdint.h>
    #include <stdlib.h>
    #include "misc.h"
    
    static int g1;
    const int g2 = 45;
    char g3 = 12;
    char g4 = 0;
    extern char g5[N];
    
    int main()
    {
      register int l1;
      int * l2;
      volatile int l3 = 12;
      
      l2 = (int *) malloc( N * g2 * sizeof(char) );
    
      if ( ! l2 )
      {
        return -1;
      }
    
      for( l1 = 0; l1 < g2; l3++)
      {
        g1 = func(l2);
      }
    
      return 0;
    }
```

#### sources.mk [3]
```makefile
    SOURCES =   \
        main.c  \
        misc.c
    
    INCLUDE_DIRS =   \
        -I../include
```

#### Makefile [3]
```makefile
    include sources.mk
    
    PLATFORM = HOST
    OBJECTS = $(SOURCES:.c=.o)
    TARGET = memory
    CFLAGS = -Wall -Werror -O0 -std=c99 $(FLAGS)
    DEPFLAGS = -MT $@ -MMD -MP -MF $*.dep
    TOOLCHAIN_DIR = /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin
    CC = $(TOOLCHAIN_DIR)/arm-none-eabi-gcc
    SIZE = $(TOOLCHAIN_DIR)/arm-none-eabi-size
    SIZE_FLAGS = -A -x
    ARCH = armv7e-m
    CPU = cortex-m4
    SPECS = nosys.specs
    LINKER_FILE = msp432p401r.lds
    LDFLAGS = -Wl,-Map=memory.map
    PLATFORM_FLAGS = -march=$(ARCH) -mcpu=$(CPU) --specs=$(SPECS) -T $(LINKER_FILE)
    OBJECTS := $(OBJECTS) $(SOURCES_MSP432:.c=.o)
    
    $(TARGET): $(OBJECTS)
        $(CC) -o $@ $^ -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(LDFLAGS) $(PLATFORM_FLAGS)
        $(SIZE) $(SIZE_FLAGS) $@
    
    %.o: %.c
        $(CC) -o $@ -c $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)
    
    %.asm: %.c
        $(CC) -o $@ -S $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)
    
    %.i: %.c
        $(CC) -o $@ -E $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)
    
    .PHONY: clean
    clean:
        -@rm *.asm *.dep *.i *.map *.o memory 2> /dev/null || true
    
    .PHONY: build
    build: $(TARGET)
    
    .PHONY: compile-all
    compile-all: $(OBJECTS)
    
    print-% :
        @echo $* = $($*)
```

#### Commands and Output
```shell
    $ make clean
    $ make build
    arm-none-eabi-gcc -o main.o -c main.c -DHOST -I../include -Wall -Werror -O0 -std=c99  -MT main.o -MMD -MP -MF main.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
    arm-none-eabi-gcc -o misc.o -c misc.c -DHOST -I../include -Wall -Werror -O0 -std=c99  -MT misc.o -MMD -MP -MF misc.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
    arm-none-eabi-gcc -o memory main.o misc.o -DHOST -I../include -Wall -Werror -O0 -std=c99  -MT memory -MMD -MP -MF .dep -Wl,-Map=memory.map -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
    arm-none-eabi-size -A -x memory
    memory  :
    section             size         addr
    .text              0xd7c          0x0
    .rodata             0x18        0xd7c
    .eh_frame            0x4        0xd94
    .ARM.exidx           0x8        0xd98
    .data              0x874   0x20000000
    .bss                0x88   0x20000874
    .ARM.attributes     0x2a          0x0
    .comment            0x75          0x0
    .debug_frame       0x414          0x0
    Total             0x1b4f
    
    
    $ cat memory.map
    
    Memory Configuration
    
    Name             Origin             Length             Attributes
    MAIN_FLASH       0x0000000000000000 0x0000000000040000 xr
    INFO_FLASH       0x0000000000200000 0x0000000000004000 xr
    SRAM_CODE        0x0000000001000000 0x0000000000010000 xrw
    SRAM_DATA        0x0000000020000000 0x0000000000010000 rw
    *default*        0x0000000000000000 0xffffffffffffffff
    
    
    $ cat msp432p401r.lds
    
    MEMORY
    {
        MAIN_FLASH (RX) : ORIGIN = 0x00000000, LENGTH = 0x00040000
        INFO_FLASH (RX) : ORIGIN = 0x00200000, LENGTH = 0x00004000
        SRAM_CODE  (RWX): ORIGIN = 0x01000000, LENGTH = 0x00010000
        SRAM_DATA  (RW) : ORIGIN = 0x20000000, LENGTH = 0x00010000
    }
    
    REGION_ALIAS("REGION_TEXT", MAIN_FLASH);
    REGION_ALIAS("REGION_INFO", INFO_FLASH);
    REGION_ALIAS("REGION_BSS", SRAM_DATA);
    REGION_ALIAS("REGION_DATA", SRAM_DATA);
    REGION_ALIAS("REGION_STACK", SRAM_DATA);
    REGION_ALIAS("REGION_HEAP", SRAM_DATA);
    REGION_ALIAS("REGION_ARM_EXIDX", MAIN_FLASH);
    REGION_ALIAS("REGION_ARM_EXTAB", MAIN_FLASH);
    
    
    $ arm-none-eabi-nm memory | grep g1 && arm-none-eabi-objdump -x memory | grep g1
    20000890 b g1
    20000890 l       .bss	00000004 g1
    
    arm-none-eabi-nm memory | grep g2 && arm-none-eabi-objdump -x memory | grep g2
    00000d7c R g2
    00000d7c g     O .rodata	00000004 g2
    
    $ arm-none-eabi-nm memory | grep g3 && arm-none-eabi-objdump -x memory | grep g3
    20000004 D g3
    20000004 g     O .data	00000001 g3
    
    $ arm-none-eabi-nm memory | grep g4 && arm-none-eabi-objdump -x memory | grep g4
    20000894 B g4
    20000894 g     O .bss	00000001 g4
    
    $ arm-none-eabi-nm memory | grep g5 && arm-none-eabi-objdump -x memory | grep g5
    20000008 D g5
    20000008 g     O .data	00000028 g5
    
    $ arm-none-eabi-nm memory | grep main && arm-none-eabi-objdump -x memory | grep main
    00000040 T _mainCRTStartup
    000000b4 T main
    00000000 l    df *ABS*	00000000 main.c
    00000040 g     F .text	00000000 _mainCRTStartup
    000000b4 g     F .text	00000058 main
    
    $ arm-none-eabi-nm memory | grep func && arm-none-eabi-objdump -x memory | grep func
    00000108 T func
    00000108 g     F .text	00000074 func
    
    
    $ cat memory.map | grep main
                                  main.o (malloc)
    LOAD main.o
                    0x0000000000000040                _mainCRTStartup
     .text          0x00000000000000b4       0x58 main.o
                    0x00000000000000b4                main
     .rodata        0x0000000000000d7c        0x4 main.o
     .data          0x0000000020000004        0x1 main.o
     .bss           0x0000000020000890        0x5 main.o
                    0x0000000000000068       0x2e main.o
     .comment       0x0000000000000000       0x75 main.o
    
    
    $ cat memory.map | grep func
                    0x0000000000000108                func

    
    $ arm-none-eabi-objdump -s -j.rodata memory
    
    memory:     file format elf32-littlearm
    
    Contents of section .rodata:
     0d7c 2d000000 48656c6c 6f20576f 726c6421  -...Hello World!
     0d8c 0a000000 38000020                    ....8..

```

#### Symbol Information
The summary of segment, sub-segment, permissions, and lifetime for each symbol below
was derived from the commands and output from the previous section above.
```
    Symbol            Segment     Sub-Segment    Permissions    Lifetime      Answer
    --------------------------------------------------------------------------------
    g1                data        bss            rw             program       2332
    g2                code        const/rodata   r              program       1512
    g3                data        data           rw             program       2432
    g4                data        bss            rw             program       2332
    g5                data        data           rw             program       2432
    N                 none        none           none           none          5644
    l1                register    none           rw             function      4631
    l2                data        stack          rw             function      2131
    *l2               data        heap           rw             indefinite    2233
    l3                data        stack          rw             function      2131
    f1                data        stack          rw             function      2131
    f2                data        bss            rw             program       2332
    f3                data        stack          rw             function      2131
    "Hello World!"    code        const/rodata   r              program       1512
    SOME_VALUE        none        none           none           none          5644
    main              data        text           r              function      1712
    func              data        text           r              function      1712
```

#### FIXME: CMakeLists.txt
I've attempted to create below CMake file for cross-compilation using the same
bare-metal ARM toolchain used with GNU Make above.  See FIXME linker warning below:
```cmake
    #
    # FIXME:
    #
    # /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/../lib/gcc/arm-none-eabi/8.2.1/../../../../arm-none-eabi/bin/ld:
    # warning: cannot find entry symbol arch_paths_first; defaulting to 000000000000800c
    #
    # for some reason this appears to be coming from the flag: "-search_paths_first"...
    # "-se" is parsed as individual flags and the remaining "arch_paths_first" is garbage
    #
    cmake_minimum_required(VERSION 3.13)
    project(3_week)
    set(CMAKE_C_STANDARD 99)
    
    include_directories(${PROJECT_SOURCE_DIR}/include)
    
    set(TARGET memory)
    set(CMAKE_C_COMPILER /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc)
    set(LINKER_FILE ${PROJECT_SOURCE_DIR}/src/msp432p401r.lds)
    
    set(CMAKE_C_FLAGS "-v -g -march=armv7e-m -mcpu=cortex-m4 -Wall -Werror -O0 -std=c99 --specs=nosys.specs -T ${LINKER_FILE}")
    file(GLOB SOURCE_FILES "${PROJECT_SOURCE_DIR}/src/*.c")
    
    add_executable(${TARGET} ${SOURCE_FILES})
    set_target_properties(${TARGET} PROPERTIES LINK_DEPENDS ${LINKER_FILE})
```